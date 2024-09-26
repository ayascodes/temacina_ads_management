import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAd } from '../features/ad/adSlice'; // Import the addAd action
import { RootState } from '../redux/store'; // Adjust the import path as needed

type Product = {
  id: string;
  name: string;
  description: string;
};

const CompleteInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  /* const companyOrigin = useSelector((state: RootState) => state.company.origin); */
  const companyOrigin = "algerienne"; // for now

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
    return ((price * duration)/selectedOffer.duration).toFixed(2);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOffer && selectedProductId) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (selectedProduct) {
        const newAd = {
          productId: selectedProductId,
          type_de_publicite: selectedProduct.name,
          offerId: selectedOffer.id,
          offerTitle: selectedOffer.title,
          offerSubtitle: selectedOffer.subtitle,
          description: `${selectedOffer.title} ${selectedOffer.subtitle}`.trim(),
          commence_le:startDate,
          duree:duration,
          montant_totale: calculateTotalPrice(selectedOffer.price, duration),
          origine_de_lentreprise: companyOrigin,
          paymentMethod,
          status: 'Pending' , 
          
        };
        dispatch(addAd(newAd));
        // Navigate to next step or show success message
        console.log('Ad created:', newAd);
      }
    }
  };

  if (!selectedOffer) {
    return <p>Please select an offer before proceeding.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
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

      <button 
        type="submit"
        style={{ 
          display: 'block', 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer', 
          marginTop: '20px' 
        }}
      >
        Create Ad
      </button>
    </form>
  );
};

export default CompleteInfoStep;