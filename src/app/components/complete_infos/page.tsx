"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Container, Paper } from '@mui/material';
import DragAndDropUpload from '../drag_and_drop/dad';
import PreviewComponent from '../drag_and_drop/PreviewComponent';
type Product = {
  id: string;
  name: string;
  description: string;
};

type CompleteInfoStepProps = {
  formData: {
    startDate: string;
    additionalDuration: number;
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

  // Get adType from Redux store
  const adType = useSelector((state: any) => state.ad.currentAdType);
  console.log("hey from COMPLETEINFO" , adType);

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
    setFormData(prevFormData => ({
      ...prevFormData,
      additionalDuration: prevFormData.additionalDuration + 5
    }));
  };
  const totalDuration = selectedOffer.duration + formData.additionalDuration;

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, paymentMethod: event.target.value });
  };

  if (!selectedOffer) {
    return <p>Please select an offer before proceeding.</p>;
  }

  const calculateTotalPrice = (price: number, duration: number): string => {
    return ((price * duration) / selectedOffer.duration).toFixed(2);
  };
  return (
    <>
    <Container className="productInfoContainer" maxWidth="xl">
      <Paper className="paper2" elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
    
      
      <div className='CompleteInfoText'>
        <h1>Publicité <span className='highlight'> {selectedOffer.title} - {selectedOffer.subtitle}</span></h1>
        {selectedProductName && adType === 'produit' && (
          <h3>{selectedProductName}</h3>
        )}
      </div>



      <div className='CompleteInfoInputContainer'>
        <label className='label'>Commance le:</label>
        <input 
           id="date"
          type="date" 
          value={formData.startDate} 
          onChange={handleDateChange}
          required
          className='CompleteInfoInput'
          placeholder="Date de debut"
        />
      </div>

      <div className='CompleteInfoInputContainer'>
          <label className='label' htmlFor="duration">La durée :</label>
          <div className="whatever">
          <input 
            type="text" 
            id="duration" 
            value={`${totalDuration} ${selectedOffer.durationUnit}`}
            readOnly 
            className='CompleteInfoInput'
          />
          <button 
            type="button" 
            onClick={handleDurationIncrease}
            id='counterBtn'
          >
            +5
          </button>
          </div>
        
      </div>

      <div className='CompleteInfoInputContainer'>
        <label className='label' htmlFor="payment-method">Mehthode de paiement :</label>
        <select 
          id="payment-method" 
          value={formData.paymentMethod} 
          onChange={handlePaymentMethodChange}
          style={{background:"#ffffff"}}
          required
          className='CompleteInfoInput'
        >
          <option value="" disabled>Selectionnez une methode de paiement</option>
          {paymentMethods.map((method, index) => (
            <option key={index} value={method}>{method}</option>
          ))}
        </select>
      </div>
      <div className='CompleteInfoInputContainer'>
        <label className='label' htmlFor="Total-price">Montant total :</label>
        <input 
              type="text" 
              id="price" 
              value={`${calculateTotalPrice(selectedOffer.price, totalDuration)} ${selectedOffer.priceUnit}`}
              readOnly 
              className='CompleteInfoInput'
            />
      </div>
        {adType === 'megaHautSlide' && (
          <div style={{ padding: '20px' }}>
          <h2>File Upload Example with TypeScript and Redux</h2>
          {/* Drag and Drop Upload */}
          <DragAndDropUpload />
    
          {/* Button to visualize the uploaded image */}
          <PreviewComponent />
        </div>
        )}
    </Paper>
    </Container>
    </>
  );
};

export default CompleteInfoStep;