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
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import OfferSelection from '../components/choose_offer/OfferSelection';
import CompleteInfoStep from '../components/complete_infos/page';
import ValidationStep from '../components/validation/page';
import PaymentStep from '../components/payment/page';
import { addAdDetails } from '../components/features/ad/adSlice';
import { RootState } from '../components/redux/store';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#FF561C',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#FF561C',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#FF561C',
    }),
    '& .CustomStepIcon-completedIcon': {
      color: '#FF561C',
      zIndex: 1,
      fontSize: 18,
    },
    '& .CustomStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }),
);

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <CustomStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="CustomStepIcon-completedIcon" />
      ) : (
        <div className="CustomStepIcon-circle" />
      )}
    </CustomStepIconRoot>
  );
}

const steps = ['Choix de l’offre', 'Informations de la publicite', 'Validation pour paiement', 'Paiement'];

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
  const adType = useSelector((state: RootState) => state.ad.currentAdType);
  const currentAd = useSelector((state: RootState) => state.ad.currentAd);


  const [formData, setFormData] = useState({
    startDate: '',
    additionalDuration: 0,
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
    if (selectedOffer) {
      const totalDuration = Number(selectedOffer.duration) + Number(formData.additionalDuration);
      const newAd = {
        id: currentAd?.id, // Use the id from currentAd if it exists
        productId: adType === 'produit' ? selectedProductId : null,
        type_de_publicite: adType === 'produit' ? selectedProductName :"Mega Haut Slide",
        offerId: selectedOffer.id,
        offerTitle: selectedOffer.title,
        offerSubtitle: selectedOffer.subtitle,
        description: `${selectedOffer.title} ${selectedOffer.subtitle}`.trim(),
        commence_le: formData.startDate,
        duree: totalDuration,
        montant_totale: `${calculateTotalPrice(selectedOffer.price, totalDuration)} ${selectedOffer.priceUnit}`.trim(),
        durationUnit: selectedOffer.durationUnit,
        origine_de_lentreprise: companyData.company.origin,
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
        file: currentAd?.file, // Include the file data if it exists
      };
      dispatch(addAdDetails(newAd));
      console.log("New Ad Object:", newAd);
      setShowAlert(true);
      setActiveStep(2); // Move to Validation step
      setAdCreated(true);
    }
  };

  const calculateTotalPrice = (price: number, duration: number): string => {
    const totalPrice = (price * duration) / Number(selectedOffer.duration);
    return totalPrice.toFixed(2);
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

  const isNextButtonDisabled = () => {
    if (activeStep === 2) {
      return adStatus !== 'approved';
    }
    return false;
  };
  return (
    <>
      {/* Conditionally apply blur to the entire page when alert is shown */}
      <div className={showAlert ? 'blur-background' : ''}>
        <div className="marketin_visual_title">
          <h1>Marketing Visuel  DA TTC/Jour</h1>
        </div>
        <Box className="StepperContainer" sx={{ width: '100%', p: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color="inherit" onClick={handleStep(index)} disabled={adCreated && index < activeStep}>
                  <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 3 }}>
          {activeStep === 0 && companyData ? (
                <OfferSelection />
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
                {activeStep === 1 && <CompleteInfoStep formData={formData} setFormData={setFormData} />}
                {activeStep === 2 && (
                  <>
                   {/*  {showAlert && (
                      <Alert
                        severity="success"
                        onClose={() => setShowAlert(false)}
                        sx={{
                          mb: 2,
                          position: 'fixed',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 'fit-content',
                          zIndex: 1000,
                        }}
                      >
                        Annonce créée avec succès ! Elle est en attente de l'approbation de l'administrateur.
                        <Link href="/">
                          <Button color="inherit" size="small">
                            Retour à la page principale du marketing visuel
                          </Button>
                        </Link>
                      </Alert>
                    )} */}
                    <ValidationStep onApprove={handleAdApproval} />
                  </>
                )}
                {activeStep === 3 && <PaymentStep />}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                  <Button
                    className="backBtn"
                    disabled={activeStep === 0 || adCreated}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Retour
                  </Button>
                  <Button 
                      onClick={activeStep === 2 && adStatus !== 'approved' ? () => window.location.href = '/' : handleNext} 
                      className="nextBtn"
                    >
                      {activeStep === 2 && adStatus !== 'approved' 
                        ? 'Retour à la page principale du marketing visuel'
                        : activeStep === steps.length - 1 ? 'Fin' : 'Continuer'}
                    </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Box>
      </div>
  
      {/* Custom alert at the center of the screen */}
      {showAlert && (
        <Alert
          severity="success"
          onClose={() => setShowAlert(false)}
          sx={{
            mb: 2,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center it vertically and horizontally
            width: 'fit-content',
            zIndex: 1000, // Ensure it's above everything else
          }}
        >
          Annonce créée avec succès ! Elle est en attente de l'approbation de l'administrateur.
          <Link href="/">
            <Button color="inherit" size="small">
            Retour à la page principale du marketing visuel
            </Button>
          </Link>
        </Alert>
      )}
    </>
  );
    
}