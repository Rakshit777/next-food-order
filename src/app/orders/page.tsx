"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName?: string;
  address?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  data: Order[];
}

export default function OrdersListingPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const result: ApiResponse = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Sort by newest first if createdAt is available
          const sortedData = [...result.data].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          });
          setOrders(sortedData);
        } else {
          // In case the API returns the array directly without 'success' wrapper
          if (Array.isArray(result)) {
             setOrders(result);
          } else {
             setOrders([]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Polling removed as requested - fetch only once on mount
  }, []);

  const handleDelete = async (e: React.MouseEvent, orderId: string) => {
    e.preventDefault(); // Prevent navigating to the order tracking page
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Order deleted successfully');
        setOrders(prev => prev.filter(o => o._id !== orderId));
      } else {
        toast.error('Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting order');
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const s = status || 'Order Received';
    switch (s) {
      case 'Order Received': return 'var(--warning)';
      case 'Preparing': return '#3b82f6'; // blue
      case 'Out for Delivery': return '#a855f7'; // purple
      case 'Delivered': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    const s = status || 'Order Received';
    switch (s) {
      case 'Order Received': return '📋';
      case 'Preparing': return '🧑‍🍳';
      case 'Out for Delivery': return '🛵';
      case 'Delivered': return '✅';
      default: return '⏳';
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => {
      return total + (item.menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-secondary)' }}>Loading orders...</h2>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div style={containerStyles}>
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)' }}>Oops!</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{error}</p>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} className="animate-fade-in">
      <div style={headerStyles}>
        <h1>Your Orders</h1>
        <button className="btn-outline" onClick={() => router.push('/')}>Back to Menu</button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>No orders found</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => router.push('/')}>
            Start Ordering
          </button>
        </div>
      ) : (
        <div style={gridStyles}>
          {orders.map((order) => (
            <Link href={`/order/${order._id}`} key={order._id}>
              <div className="glass-panel" style={orderCardStyles}>
                <div style={cardHeaderStyles}>
                  <div>
                    <span style={orderIdStyles}>Order #{order._id.substring(0, 8).toUpperCase()}</span>
                    {order.createdAt && (
                      <div style={dateStyles}>{new Date(order.createdAt).toLocaleString()}</div>
                    )}
                  </div>
                  <div style={{...statusBadgeStyles, color: getStatusColor(order.status), borderColor: getStatusColor(order.status)}}>
                    <span style={{ marginRight: '0.5rem' }}>{getStatusIcon(order.status)}</span>
                    {order.status || 'Order Received'}
                  </div>
                </div>

                <div style={itemsContainerStyles}>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} style={itemStyles}>
                      <div style={itemDetailsStyles}>
                        <span style={quantityStyles}>{item.quantity}x</span>
                        <span>{item.menuItem?.name || 'Unknown Item'}</span>
                      </div>
                      <span>${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={cardFooterStyles}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {order.customerName && (
                      <div style={customerInfoStyles}>
                        <span>👤 {order.customerName}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, order._id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                  <div style={totalStyles}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                      ${calculateTotal(order.items).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '4rem 20px',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '3rem',
};

const gridStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const orderCardStyles: React.CSSProperties = {
  padding: '1.5rem',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '1rem',
};

const orderIdStyles: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: 'white',
};

const dateStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginTop: '0.25rem',
};

const statusBadgeStyles: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  border: '1px solid',
  fontWeight: 600,
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.2)',
};

const itemsContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const itemStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  color: 'var(--text-secondary)',
};

const itemDetailsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
};

const quantityStyles: React.CSSProperties = {
  color: 'white',
  fontWeight: 'bold',
  minWidth: '24px',
};

const cardFooterStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1rem',
  marginTop: '0.5rem',
};

const customerInfoStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
};

const totalStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  fontSize: '1.25rem',
};
