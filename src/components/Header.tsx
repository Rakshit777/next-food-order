"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CartSidebar } from './CartSidebar';

export const Header = () => {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header style={headerStyles} className="glass-panel">
        <div style={containerStyles}>
          <Link href="/" style={logoStyles}>
            🍔 Gourmet <span style={{ color: 'var(--primary)' }}>Delivery</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              href="/orders" 
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', color: 'white' }}
            >
              📦 Orders
            </Link>
            <button 
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'var(--surface-hover)', color: 'white' }}
              onClick={() => setIsCartOpen(true)}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span style={badgeStyles}>{cartCount}</span>
              )}
            </button>
          </nav>
        </div>
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 40px)',
  maxWidth: '1200px',
  height: '70px',
  zIndex: 100,
  padding: '0 20px',
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  width: '100%'
};

const logoStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  letterSpacing: '-0.5px'
};

const badgeStyles: React.CSSProperties = {
  background: 'var(--primary)',
  color: 'white',
  borderRadius: '50%',
  padding: '2px 8px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};
