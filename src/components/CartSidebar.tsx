"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <div style={overlayStyles} onClick={onClose} className="animate-fade-in" />
      <div style={sidebarStyles} className="animate-slide-in-right">
        <div style={headerStyles}>
          <h2>Your Cart</h2>
          <button onClick={onClose} style={closeBtnStyles}>✕</button>
        </div>
        
        <div style={itemsContainerStyles}>
          {cart.length === 0 ? (
            <div style={emptyStyles}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🛒</div>
              <h3 style={{ color: 'var(--text-primary)' }}>Your cart is empty</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Looks like you haven't added any delicious items yet.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={cartItemStyles}>
                <div style={itemImageStyles}>
                  <Image src={item.image} alt={item.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <div style={itemInfoStyles}>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 5px' }}>{item.name}</h4>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price.toFixed(2)}</div>
                  <div style={qtyControlsStyles}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyBtnStyles}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtnStyles}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={removeBtnStyles}>🗑️</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={footerStyles}>
            <div style={totalStyles}>
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 999,
};

const sidebarStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  maxWidth: '400px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--bg-color)',
  boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
  borderLeft: '1px solid var(--border-color)',
};

const headerStyles: React.CSSProperties = {
  padding: '1.5rem',
  borderBottom: '1px solid var(--glass-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeBtnStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  color: 'var(--text-secondary)',
};

const itemsContainerStyles: React.CSSProperties = {
  flexGrow: 1,
  overflowY: 'auto',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const emptyStyles: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-secondary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '2rem',
};

const cartItemStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
};

const itemImageStyles: React.CSSProperties = {
  flexShrink: 0,
};

const itemInfoStyles: React.CSSProperties = {
  flexGrow: 1,
};

const qtyControlsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '10px',
};

const qtyBtnStyles: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '4px',
  backgroundColor: 'var(--surface-hover)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const removeBtnStyles: React.CSSProperties = {
  color: 'var(--primary)',
  fontSize: '1.2rem',
};

const footerStyles: React.CSSProperties = {
  padding: '1.5rem',
  borderTop: '1px solid var(--glass-border)',
  backgroundColor: 'rgba(0,0,0,0.2)',
};

const totalStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};
