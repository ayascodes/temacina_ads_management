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
  type CompanyMarche = 'algérien' | 'international';

  const CompleteInfoStep: React.FC<CompleteInfoStepProps> = ({ formData, setFormData }) => {
    const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
    const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
    const [products, setProducts] = useState<Product[]>([]);
    const [companyData, setCompanyData] = useState<any>(null); // we are ftching company data here to get companyMarche infos
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    console.log("DEBUG SELECTED OFFER DATA" ,selectedOffer);

    

    // Get adType from Redux store
    const adType = useSelector((state: any) => state.ad.currentAdType);
    console.log("hey from COMPLETEINFO" , adType);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const productsResponse = await fetch('/data/products.json');
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [])

    const getProductNameById = (id: string | null): string | null => {
      if (!id) return null;
      const product = products.find(product => product.id === id);
      return product ? product.name : null;
    };
/* -------------------------------- */
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [companyResponse] = await Promise.all([
        fetch('/data/companyData.json')
        
      ]);

      if (!companyResponse.ok) throw new Error(`HTTP error! status: ${companyResponse.status}`);
      

      const companyData = await companyResponse.json();
      

      setCompanyData(companyData);
      
    } catch (e) {
      setError(`Failed to fetch data: ${e instanceof Error ? e.message : String(e)}`);
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

  const selectedProductName = getProductNameById(selectedProductId);
    const companyMarche = companyData.company.selectedMarket;
    console.log("DEBUG COMPANY MARCHE", companyData);
    /* paymentMethods according to companyMarche  */
   let paymentMethods:string[]; 

     if (companyMarche === 'algérien') {
      paymentMethods = ['Alg placeholder 1 ', 'Alg placeholder 2','Alg placeholder 3'];
    } else if (companyMarche === 'international') {
      paymentMethods = ['Int placeholder 1 ', 'Int placeholder 2','Int placeholder 3'];
    } else {
      paymentMethods = []; // Default or fallback payment methods
    }
 
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, startDate: event.target.value });
    };

    const handleDurationIncrease = () => {
      setFormData(prevFormData => ({
        ...prevFormData,
        additionalDuration: Number(prevFormData.additionalDuration) + 5
      }));
    };
    
    const totalDuration = Number(selectedOffer.duration) + Number(formData.additionalDuration);
    console.log("DEBUG TOTAL DURATION",totalDuration)

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData({ ...formData, paymentMethod: event.target.value });
    };

    if (!selectedOffer) {
      return <p>Please select an offer before proceeding.</p>;
    }

    const calculateTotalPrice = (price: number, duration: number): string => {
      const totalPrice = (price * duration) / Number(selectedOffer.duration);
      return totalPrice.toFixed(2);
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
                value={`${calculateTotalPrice(Number(selectedOffer.price), totalDuration)} ${selectedOffer.priceUnit}`}
                readOnly 
                className='CompleteInfoInput'
              />
        </div>
          {adType === 'megaHautSlide' && (
            <div style={{ padding: '20px' }}>
            <h2>Ajouter votre fichier</h2>
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