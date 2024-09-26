"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import ChooseOffer from '../components/choose_offer/page';
import CompleteInfoStep from '../components/complete_infos/page';
import ValidationStep from '../components/validation/page';
import PaymentStep from '../components/payment/page';
import { addAd } from '../components/features/ad/adSlice';
import { RootState } from '../components/redux/store';

const steps = ['Choose Offer', 'Complete Info', 'Validation', 'Payment'];

export default function HybridStepper() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [adStatus, setAdStatus] = useState('pending');
  const [companyData, setCompanyData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const selectedOffer = useSelector((state: RootState) => state.offer.selectedOffer);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  const [products, setProducts] = useState<Product[]>([]);
  const [adCreated, setAdCreated] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    duration: selectedOffer ? selectedOffer.duration : 5,
    paymentMethod: '',
  });
  type Product = {
  id: string;
  name: string;
  description: string;
};
  // Fetch company data from JSON
  useEffect(() => {
    const fetchCompanyData = async () => {
      const response = await fetch('/data/companyData.json');
      const data = await response.json();
      setCompanyData(data);
    };
    
    fetchCompanyData();
  }, []); 

  // Retrieve saved progress from localStorage on initial mount
  useEffect(() => {
    const savedStep = localStorage.getItem('activeStep');
    const savedCompleted = localStorage.getItem('completedSteps');
    const savedAdStatus = localStorage.getItem('adStatus');

    if (savedStep) setActiveStep(parseInt(savedStep));
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted));
    if (savedAdStatus) setAdStatus(savedAdStatus);
  }, []); // Empty dependency array ensures this runs only once on mount
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeStep', activeStep.toString());
    localStorage.setItem('completedSteps', JSON.stringify(completed));
    localStorage.setItem('adStatus', adStatus);
  }, [activeStep, completed, adStatus]);

  useEffect(() => {
    // Move to next step when an offer is selected
    if (selectedOffer && activeStep === 0) {
      handleNext();
    }
  }, [selectedOffer]);

  // Fetch products data
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

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    if (activeStep === 1) { // CompleteInfoStep
      handleAdCreation();
    } else {
      const newActiveStep = isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };
  const getProductNameById = (id: string | null): string | null => {
    if (!id) return null;
    const product = products.find(product => product.id === id);
    return product ? product.name : null;
  };
  const selectedProductName = getProductNameById(selectedProductId);

  const handleAdCreation = () => {
    if (selectedOffer && selectedProductId) {
      const newAd = {
        productId: selectedProductId,
        type_de_publicite: selectedProductName, // Assuming this is correct, adjust if needed
        offerId: selectedOffer.id,
        offerTitle: selectedOffer.title,
        offerSubtitle: selectedOffer.subtitle,
        description: `${selectedOffer.title} ${selectedOffer.subtitle}`.trim(),
        commence_le: formData.startDate,
        duree: formData.duration,
        durationUnit: selectedOffer.durationUnit,
        montant_totale: `${calculateTotalPrice(selectedOffer.price, formData.duration)} ${selectedOffer.priceUnit}`.trim(),
        origine_de_lentreprise: companyData.company.origin, // Adjust as needed
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
      };
      dispatch(addAd(newAd));
      setShowAlert(true);
      setActiveStep(2); // Move to Validation step
      setAdCreated(true); // Set adCreated to true after creating the ad
    }
  };

  const calculateTotalPrice = (price: number, duration: number): string => {
    return ((price * duration) / selectedOffer.duration).toFixed(2);
  };

  const handleBack = () => {
    if (!adCreated) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStep = (step: number) => () => {
    if (!adCreated && (completed[step - 1] || step === activeStep)) {
      setActiveStep(step);
    }
  };


  const handleComplete = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setAdStatus('pending');
    // Clear localStorage when resetting
    localStorage.removeItem('activeStep');
    localStorage.removeItem('completedSteps');
    localStorage.removeItem('adStatus');
  };

  const handleAdApproval = () => {
    setAdStatus('approved');
    const newCompleted = { ...completed, 2: true }; 
    setCompleted(newCompleted);
  };
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={handleStep(index)} disabled={adCreated && index < activeStep}>
              <StepLabel>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ p: 3 }}>
        {activeStep === 0 && companyData ? (
          <ChooseOffer 
            companyType={companyData.company.Type}
            companyMarche={companyData.company.selectedMarket}
            companySecteur={companyData.company.selectedSectors}
            origineEntreprise={companyData.company.origin}
          />
        ) : allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you're finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            {activeStep === 1 && <CompleteInfoStep formData={formData} setFormData={setFormData} />}
            {activeStep === 2 && (
              <>
                {showAlert && (
                  <Alert severity="success" onClose={() => setShowAlert(false)} sx={{ mb: 2 }}>
                    Ad successfully created! It's waiting for admin approval.
                    <Link href="/">
                      <Button color="inherit" size="small">
                        Go to Ad Management
                      </Button>
                    </Link>
                  </Alert>
                )}
                <ValidationStep />
              </>
            )}
            {activeStep === 3 && <PaymentStep />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0 || adCreated}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );  
}