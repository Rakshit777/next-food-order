import React from 'react';
import { MenuCard } from '../components/MenuCard';
import { MenuItem } from '../data/menu';

export default async function Home() {
  let menuItems: MenuItem[] = [];
  
  try {
    const res = await fetch('http://localhost:5000/api/menu', { cache: 'no-store' });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        menuItems = result.data.map((item: any) => ({
          ...item,
          id: item._id || item.id,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }

  return (
    <div style={containerStyles}>
      <div style={heroStyles}>
        <h1 style={titleStyles}>Crave-Worthy Food, <span style={{ color: 'var(--primary)' }}>Delivered.</span></h1>
        <p style={subtitleStyles}>Select from our curated menu of premium dishes prepared by top chefs.</p>
      </div>

      <div style={gridStyles}>
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>No menu items available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '4rem 20px',
};

const heroStyles: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '4rem',
  animation: 'fadeIn 0.6s ease-out forwards',
};

const titleStyles: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
  fontWeight: 900,
  letterSpacing: '-1px',
  lineHeight: 1.1,
  marginBottom: '1rem',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  maxWidth: '600px',
  margin: '0 auto',
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '2rem',
};
