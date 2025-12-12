import React, { useState } from 'react';
import QuickContact from './QuickContact';
import OrderNotification from './OrderNotification';

interface FloatingWidgetsProps {
  products?: Array<{ name: string; type: string; slug: string }>;
}

const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ products = [] }) => {
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);

  return (
    <>
      <QuickContact isOpen={isQuickContactOpen} setIsOpen={setIsQuickContactOpen} />
      <OrderNotification products={products} />
    </>
  );
};

export default FloatingWidgets;
