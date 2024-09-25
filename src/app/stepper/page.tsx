"use client";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChooseOffer from '../components/choose_offer/page'; // Adjust the import based on your file structure

const steps = ['Choose Offer', 'Complete Info', 'Validation', 'Payment'];

export default function HybridStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [adStatus, setAdStatus] = useState('pending');
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    // Simulating fetching data from a JSON file
    const fetchCompanyData = async () => {
      const response = await fetch('/data/companyData.json'); // Adjust the path to your JSON file
      const data = await response.json();
      setCompanyData(data);
    };
    
    fetchCompanyData();
  }, []);

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    if (completed[step - 1] || step === activeStep) {
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
  };

  const handleAdApproval = () => {
    setAdStatus('approved');
    const newCompleted = { ...completed, 2: true }; 
    setCompleted(newCompleted);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              <StepLabel>
                {label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === 0 && companyData ? (
          <ChooseOffer 
            companyType="ordinaire" // You can dynamically set this from companyData if needed
            companyMarche="algérien" // Similarly, adjust as needed
            companySecteur="Construction" // Adjust based on your JSON
            origineEntreprise="algérienne" // Adjust as needed
          />
        ) : allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === 2 ? (
                adStatus === 'pending' ? (
                  <Button onClick={() => alert('Redirecting to ads management dashboard')}>
                    Check Ad Status
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Proceed to Payment
                  </Button>
                )
              ) : (
                <Button onClick={handleComplete}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
      {activeStep === 2 && adStatus === 'pending' && (
        <Button onClick={handleAdApproval} sx={{ mt: 2 }}>
          Simulate Admin Approval
        </Button>
      )}
    </Box>
  );
}
