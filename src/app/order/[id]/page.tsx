"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type OrderStatus = 'Order Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [status, setStatus] = useState<OrderStatus>('Order Received');
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`);
        if (response.ok) {
          const result = await response.json();
          // The API likely returns { success: true, data: { status: '...' } }
          const orderData = result.data || result;
          const currentStatus = orderData.status || 'Order Received';
          setStatus(currentStatus);
          
          if (currentStatus === 'Order Received') setProgress(25);
          else if (currentStatus === 'Preparing') setProgress(50);
          else if (currentStatus === 'Out for Delivery') setProgress(75);
          else if (currentStatus === 'Delivered') setProgress(100);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    // Fetch immediately
    fetchOrderStatus();
    
    // Poll every 3 seconds
    const interval = setInterval(fetchOrderStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusIcon = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'Order Received': return '📋';
      case 'Preparing': return '🧑‍🍳';
      case 'Out for Delivery': return '🛵';
      case 'Delivered': return '✅';
      default: return '⏳';
    }
  };

  return (
    <div style={containerStyles} className="animate-fade-in">
      <div className="glass-panel" style={cardStyles}>
        <div style={headerStyles}>
          <span style={orderIdStyles}>Order #{orderId}</span>
          <button className="btn-outline" onClick={() => router.push('/')}>Back to Menu</button>
        </div>

        <div style={statusContainerStyles}>
          <div style={iconStyles} className="animate-fade-in" key={status}>
            {getStatusIcon(status)}
          </div>
          <h2 style={statusTextStyles}>{status}</h2>
          {status !== 'Delivered' && (
            <p style={subTextStyles}>Your order is being processed. Please wait.</p>
          )}
          {status === 'Delivered' && (
            <p style={{ color: 'var(--success)', marginTop: '0.5rem' }}>Enjoy your meal!</p>
          )}
        </div>

        <div style={progressContainerStyles}>
          <div style={{...progressBarStyles, width: `${progress}%`}} />
        </div>
        
        <div style={stepsStyles}>
          <span style={{ color: progress >= 25 ? 'white' : 'var(--text-secondary)' }}>Received</span>
          <span style={{ color: progress >= 50 ? 'white' : 'var(--text-secondary)' }}>Preparing</span>
          <span style={{ color: progress >= 75 ? 'white' : 'var(--text-secondary)' }}>Delivery</span>
          <span style={{ color: progress === 100 ? 'var(--success)' : 'var(--text-secondary)' }}>Delivered</span>
        </div>
      </div>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '4rem 20px',
  textAlign: 'center',
};

const cardStyles: React.CSSProperties = {
  padding: '3rem 2rem',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '3rem',
};

const orderIdStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontFamily: 'monospace',
  fontSize: '1.1rem',
};

const statusContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '3rem',
};

const iconStyles: React.CSSProperties = {
  fontSize: '4rem',
  marginBottom: '1rem',
  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))',
};

const statusTextStyles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'var(--primary)',
};

const subTextStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  marginTop: '0.5rem',
};

const progressContainerStyles: React.CSSProperties = {
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '1rem',
};

const progressBarStyles: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--primary)',
  transition: 'width 1s ease-in-out',
};

const stepsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  fontWeight: 'bold',
};
