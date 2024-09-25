"use client";
import React, { useState, useEffect } from "react";
import AdTable from './components/AdTable/AdTable';
import CompanyProfile from './components/company_profile/page';
import AdsManagment from './components/ads_managment/page';
import AdsCreation from './components/ads_creation/page';
import { Tabs, Tab, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'gray',
          fontWeight: 'bold',
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#FF561C',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#FF561C',
        },
      },
    },
  },
});

const ParentComponent = () => {
  const [value, setValue] = useState('adsCreation');
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleChange = (event, newValue) => {
    setScrollPosition(window.pageYOffset);
    setValue(newValue);
  };
  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [value, scrollPosition]);

  return (
    <ThemeProvider theme={theme}>
      <div className="parent_container">
        <h1 className="parent_title">Ads</h1>
        <CompanyProfile />
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Ads Management Tabs"
            className="Tabs"
          >
            <Tab value="adsCreation" label="Ads Creation" wrapped />
            <Tab value="adsManagment" label="Ads Management" wrapped />
          </Tabs>
        </Box>

        {value === 'adsCreation' && <AdsCreation />}
        {value === 'adsManagment' && <AdsManagment />}
      </div>
    </ThemeProvider>
  );
};

export default ParentComponent;