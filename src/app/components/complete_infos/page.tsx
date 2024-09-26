"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

type Product = {
  id: string;
  name: string;
  description: string;
};

type CompleteInfoStepProps = {
  formData: {
    startDate: string;
    duration: number;
    paymentMethod: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    startDate: string;
    duration: number;
    paymentMethod: string;
  }>>;
};

const CompleteInfoStep: React.FC<CompleteInfoStepProps> = ({ formData, setFormData }) => {
  const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  const [products, setProducts] = useState<Product[]>([]);

  const paymentMethods = ['Credit Card', 'Paypal', 'Bank Transfer'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const getProductNameById = (id: string | null): string | null => {
    if (!id) return null;
    const product = products.find(product => product.id === id);
    return product ? product.name : null;
  };

  const selectedProductName = getProductNameById(selectedProductId);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, startDate: event.target.value });
  };

  const handleDurationIncrease = () => {
    setFormData({ ...formData, duration: formData.duration + 5 });
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, paymentMethod: event.target.value });
  };

  if (!selectedOffer) {
    return <p>Please select an offer before proceeding.</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h2>Complete Information for Selected Offer</h2>
      <div>
        <h2>PUBLICITÉ {selectedOffer.title} - {selectedOffer.subtitle}</h2>
      </div>

      {selectedProductName ? (
        <h1>Selected Product: {selectedProductName}</h1>
      ) : (
        <h1>No Product Selected</h1>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="start-date">Start Date:</label>
        <input 
          type="date" 
          id="start-date" 
          value={formData.startDate} 
          onChange={handleDateChange}
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="duration">Duration {selectedOffer.durationUnit}:</label>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <input 
            type="number" 
            id="duration" 
            value={formData.duration} 
            readOnly 
            style={{ padding: '8px', width: '70%', marginRight: '5px' }} 
          />
          <button 
            type="button" 
            onClick={handleDurationIncrease}
            style={{ padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            +5
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="payment-method">Payment Method:</label>
        <select 
          id="payment-method" 
          value={formData.paymentMethod} 
          onChange={handlePaymentMethodChange}
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          required
        >
          <option value="" disabled>Select payment method</option>
          {paymentMethods.map((method, index) => (
            <option key={index} value={method}>{method}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CompleteInfoStep;