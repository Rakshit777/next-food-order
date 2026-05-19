"use client";

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartTotal, cart, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    customerName: '',
    address: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Custom Validation
    const newErrors = {
      customerName: formData.customerName.trim() === '' ? 'Customer Name is required' : '',
      address: formData.address.trim() === '' ? 'Delivery Address is required' : '',
      phone: formData.phone.length !== 10 
        ? (formData.phone.length === 0 ? 'Phone number is required' : 'Phone number must be exactly 10 digits') 
        : '',
    };

    setErrors(newErrors);

    if (newErrors.customerName || newErrors.address || newErrors.phone) {
      toast.error('Please fix the validation errors in the form');
      return;
    }
    
    try {
      const payload = {
        items: cart.map(item => ({ menuItem: (item as any)._id || item.id, quantity: item.quantity })),
        customerName: formData.customerName,
        address: formData.address,
        phone: formData.phone
      };
      
      console.log('SENDING PAYLOAD TO BACKEND:', payload);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      const orderId = orderData._id || orderData.id || Math.random().toString(36).substring(2, 9).toUpperCase();
      
      clearCart();
      toast.success('order cretaed success fully');
      router.push('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({...prev, [name]: digitsOnly }));
      
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
      } else {
        setErrors(prev => ({ ...prev, phone: digitsOnly.length === 0 ? 'Phone number is required' : '' }));
      }
    } else {
      setFormData(prev => ({...prev, [name]: value }));
      
      const displayName = name === 'customerName' ? 'Customer Name' : 'Delivery Address';
      setErrors(prev => ({ 
        ...prev, 
        [name]: value.trim() === '' ? `${displayName} is required` : '' 
      }));
    }
  };

  if (cart.length === 0) {
    return (
      <div style={containerStyles}>
        <div className="glass-panel" style={cardStyles}>
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Add some items to your cart to proceed with checkout.</p>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => router.push('/')}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} className="animate-fade-in">
      <div className="glass-panel" style={cardStyles}>
        <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
        
        <div style={orderSummaryStyles}>
          <h3>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={totalStyles}>
            <span>Total to pay:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={formStyles} noValidate>
          <h3>Delivery Details</h3>
          
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Customer Name</label>
            <input 
              required
              type="text" 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange}
              style={{
                ...inputStyles,
                borderColor: errors.customerName ? '#ef4444' : 'var(--border-color)',
              }}
              placeholder="John Doe"
            />
            {errors.customerName && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ {errors.customerName}
              </span>
            )}
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Delivery Address</label>
            <input 
              required
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange}
              style={{
                ...inputStyles,
                borderColor: errors.address ? '#ef4444' : 'var(--border-color)',
              }}
              placeholder="123 Main St, Apt 4B"
            />
            {errors.address && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ {errors.address}
              </span>
            )}
          </div>

          <div style={inputGroupStyles}>
            <label style={labelStyles}>Phone Number</label>
            <input 
              required
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              style={{
                ...inputStyles,
                borderColor: errors.phone ? '#ef4444' : 'var(--border-color)',
              }}
              placeholder="9999999999"
              maxLength={10}
            />
            {errors.phone && (
              <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ {errors.phone}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            Place Order (${cartTotal.toFixed(2)})
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '4rem 20px',
};

const cardStyles: React.CSSProperties = {
  padding: '2rem',
};

const orderSummaryStyles: React.CSSProperties = {
  backgroundColor: 'rgba(0,0,0,0.2)',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '2rem',
};

const totalStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '1.5rem',
  marginTop: '1rem',
};

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const inputGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontWeight: 500,
};

const inputStyles: React.CSSProperties = {
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'rgba(0,0,0,0.2)',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};
