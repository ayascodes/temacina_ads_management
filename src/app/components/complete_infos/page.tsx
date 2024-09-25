import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAd } from '../features/ad/adSlice'; // Import the addAd action
import { RootState } from '../redux/store'; // Adjust the import path as needed

type Product = {
  id: string;
  name: string;
  description: string;
};

interface CompleteInfoStepProps {
  onAdDataSubmit: (data: any) => void; // Add the prop type
}

const CompleteInfoStep: React.FC<CompleteInfoStepProps> = ({ onAdDataSubmit }) => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  const companyOrigin = "algerienne"; // For now

  // Local state for products and form fields
  const [products, setProducts] = useState<Product[]>([]);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(selectedOffer ? selectedOffer.duration : 5);
  const [paymentMethod, setPaymentMethod] = useState('');

  const paymentMethods = ['Credit Card', 'Paypal', 'Bank Transfer'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json'); // Ensure this path is correct
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
    setStartDate(event.target.value);
  };

  const handleDurationIncrease = () => {
    setDuration(duration + 5);
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
  };

  const calculateTotalPrice = (price: number, duration: number): string => {
    return ((price * duration) / selectedOffer.duration).toFixed(2);
  };

  const handleSubmit = () => {
    console.log('Form submitted in CompleteInfoStep');
    
    if (!startDate || !paymentMethod) {
      alert('Please fill in all required fields');
      return false;
    }

    if (selectedOffer && selectedProductId) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (selectedProduct) {
        const newAd = {
          productId: selectedProductId,
          productName: selectedProduct.name,
          offerId: selectedOffer.id,
          offerTitle: selectedOffer.title,
          offerSubtitle: selectedOffer.subtitle,
          description: `${selectedOffer.title} ${selectedOffer.subtitle}`.trim(),
          startDate,
          duration,
          TotalPrice: calculateTotalPrice(selectedOffer.price, duration),
          Origine: companyOrigin,
          paymentMethod,
          status: 'pending' as const,
        };
        
        console.log('Submitting ad data:', newAd);
        onAdDataSubmit(newAd);
        return true;
      } else {
        console.error('Selected product not found');
      }
    } else {
      console.error('No offer or product selected');
    }
    return false;
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
          value={startDate} 
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
            value={duration} 
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
          value={paymentMethod} 
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
    </div> // Closing the outermost div
  );
}
export { CompleteInfoStep, type CompleteInfoStepProps };