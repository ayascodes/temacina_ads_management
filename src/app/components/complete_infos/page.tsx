"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Container, Paper, Button } from '@mui/material';

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
    image: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    startDate: string;
    additionalDuration: number;
    paymentMethod: string;
    image: File | null;
  }>>;
};

const CompleteInfoStep: React.FC<CompleteInfoStepProps> = ({ formData, setFormData }) => {
  const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  const adType = useSelector((state: RootState) => state.ad.adType);
  const [products, setProducts] = useState<Product[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
    setFormData(prevFormData => ({
      ...prevFormData,
      additionalDuration: prevFormData.additionalDuration + 5
    }));
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, paymentMethod: event.target.value });
  };

  const handleFile = (file: File) => {
    setFormData({ ...formData, image: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleVisualize = () => {
    // Implement visualization logic here
    console.log("Visualize button clicked");
  };

  const totalDuration = selectedOffer ? selectedOffer.duration + formData.additionalDuration : 0;

  const calculateTotalPrice = (price: number, duration: number): string => {
    return ((price * duration) / (selectedOffer ? selectedOffer.duration : 1)).toFixed(2);
  };

  if (!selectedOffer) {
    return <p>Please select an offer before proceeding.</p>;
  }

  return (
    <Container className="productInfoContainer" maxWidth="xl">
      <Paper className="paper2" elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <div className='CompleteInfoText'>
          <h1>Publicité <span className='highlight'> {selectedOffer.title} - {selectedOffer.subtitle}</span></h1>
          {adType === 'produit' && selectedProductName && (
            <h3>{selectedProductName}</h3>
          )}
        </div>

        {adType === 'Mega Haut slide' && (
          <div 
            className={`CompleteInfoInputContainer upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label className='label' htmlFor="image-upload">
              {previewUrl ? 'Change Image:' : 'Upload Image:'}
            </label>
            <div className="drop-zone">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              ) : (
                <p>Drag and drop your image here or click to select</p>
              )}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className='CompleteInfoInput'
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

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

        <Button
          variant="contained"
          color="primary"
          onClick={handleVisualize}
          style={{ marginTop: '20px' }}
        >
          Visualiser
        </Button>
      </Paper>
    </Container>
  );
};

export default CompleteInfoStep;