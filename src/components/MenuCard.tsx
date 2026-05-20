"use client";

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '../data/menu';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success('Order added to cart successfully');
  };

  return (
    <div className="glass-panel animate-fade-in" style={cardStyles}>
      <div style={imageContainerStyles}>
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <h3 style={titleStyles}>{item.name}</h3>
          <span style={priceStyles}>${item.price.toFixed(2)}</span>
        </div>
        <p style={descStyles}>{item.description}</p>
        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: 'auto' }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const cardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
};

const imageContainerStyles: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '220px',
  borderBottom: '1px solid var(--glass-border)',
};

const contentStyles: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: '1rem',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  lineHeight: 1.2,
};

const priceStyles: React.CSSProperties = {
  color: 'var(--primary)',
  fontWeight: 800,
  fontSize: '1.25rem',
};

const descStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
};
