"use client";

import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { FormControlLabel, Checkbox, Radio, RadioGroup, FormControl } from '@mui/material';
import Image from 'next/image';

function CompanyProfile() {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch('/data/companyData.json');
        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }

    fetchCompanyData();
  }, []);

  if (!companyData) {
    return <p>Loading...</p>;
  }

  const { sectors, markets, currencies, company } = companyData;

  return (
    <Container className="companyProfile" >
      <div className="partone">
      <Image src="/logooo.png" alt="Company logo" width={80} height={80} />
        <h1>{company.name}</h1>
      </div>

      <div className="parttwo">
            <div>
            <h3>Description</h3>
            <p>{company.description}</p>
            </div>
        <>
            <div className="cardLine">
            <h3>Secteurs d’Activité :</h3>
            <div>
                {sectors.map((sector, index) => (
                <FormControlLabel
                    key={index}
                    control={
                    <Checkbox 
                        checked={company.selectedSectors.includes(sector)} 
                        disabled 
                    />
                    }
                    label={sector}
                />
                ))}
            </div>
            </div>

            <div className="cardLine">
            <h3>Marché visé :</h3>
            <div>
            <FormControl>
                <RadioGroup row value={company.selectedMarket}>
                {markets.map((market, index) => (
                    <FormControlLabel
                    key={index}
                    value={market}
                    control={
                        <Radio
                        disabled
                        sx={{
                            color: 'grey', 
                            '&.Mui-disabled': {
                            color: 'grey'
                            }
                        }}
                        />
                    }
                    label={market}
                    />
                ))}
                </RadioGroup>
            </FormControl>
            </div>
            </div>

            <div className="cardLine">
            <h3>Monnaie Utilisée :</h3>
            <div>
                <FormControl>
                <RadioGroup row value={company.selectedCurrency}>
                    {currencies.map((currency, index) => (
                    <FormControlLabel
                        key={index}
                        value={currency}
                        control={
                            <Radio
                                disabled
                                sx={{
                                    color: 'grey', 
                                    '&.Mui-disabled': {
                                    color: 'grey'
                                    }
                                }}
                                />
                        }
                        label={currency}
                    />
                    ))}
                </RadioGroup>
                </FormControl>
            </div>
            </div>

            <div className="cardLine">
            <h3>Origine de votre entreprise :</h3>
            <div>
                <p>{company.origin} - votre payment est en {company.selectedCurrency}</p>
            </div>
            </div>
        </>
      </div>
      
    </Container>
  );
}

export default CompanyProfile;
