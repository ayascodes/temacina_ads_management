"use client";
import React, { useState, useEffect } from 'react';
import CardOffer from '../offer_card/page';
import { useSelector } from 'react-redux';

function Draft() {
  const [companyData, setCompanyData] = useState<any>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  interface PagePlacement {
    page: string;
    placements: string[];
  }

  // Get adType from Redux store
  const adType = useSelector((state: any) => state.ad.currentAdType) || 'megaHautSlide';  // Placeholder in case adType is null
  type CompanyType = 'ordinaire' | 'startup' | 'artisanal';
  type AdType = 'produit' | 'megaHautSlide';
  type CompanySecteur = 'Industrie'| 'Agriculture' | 'Construction' | 'ITech';
  type CompanyMarche = 'algérien' | 'international';
  
  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [companyResponse, offerResponse] = await Promise.all([
          fetch('/data/companyData.json'),
          fetch('/data/choose_offer.json')
        ]);

        if (!companyResponse.ok) throw new Error(`HTTP error! status: ${companyResponse.status}`);
        if (!offerResponse.ok) throw new Error(`HTTP error! status: ${offerResponse.status}`);

        const companyData = await companyResponse.json();
        const offerData = await offerResponse.json();

        setCompanyData(companyData);
        setOfferData(offerData);
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
  if (!companyData || !offerData) return <div>No data available</div>;

  const { company } = companyData;
  const myCompanyType = company.Type;
  const myCompanySecteur = company.selectedSectors;
  const myCompanyMarche = company.selectedMarket;

  // Generate pages and placements using adType
  function generatePagesAndPlacements(
    companyType: CompanyType,
    adType: AdType,
    companySecteur: CompanySecteur,
    companyMarche: CompanyMarche
  ): PagePlacement[] {
    const pages: PagePlacement[] = [];
  
    // Common pages for all company types
    const commonPages = ['Nouvel arrivage', 'Meilleurs produits', 'Soldes'];
  
    // Helper function to add a page with placements
    const addPage = (pageName: string, placements: string[]) => {
      pages.push({ page: pageName, placements });
    };
  
    // Page d'accueil (Home page)
    if (adType === 'produit') {
      const homePlacements = [...commonPages];
      if (companyType === 'ordinaire') {
        homePlacements.push(`Marché`);
      } else if (companyType === 'startup') {
        homePlacements.push('Startup');
      } else if (companyType === 'artisanal') {
        homePlacements.push('Produit artisanal');
      }
      addPage("Page d'accueil", homePlacements);
    } else if (adType === 'megaHautSlide') {
      addPage("Page d'accueil", ['Mega Haut Slide']);
    }
  
    // Specific pages based on company type (No concatenation here)
    if (companyType === 'ordinaire') {
      addPage(`Page Secteur`, adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
    } else if (companyType === 'startup') {
      addPage('Page Startup', adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
    } else if (companyType === 'artisanal') {
      addPage('Page Produit artisanal', adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
    }
  
    // Common pages for all types
    commonPages.forEach(pageName => {
      addPage(`Page ${pageName}`, adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
    });
  
    return pages;
  }
  
  const generatedPagesAndPlacements = generatePagesAndPlacements(myCompanyType, adType, myCompanySecteur, myCompanyMarche);

  // Function to find the corresponding product for a given page and placement
  const findOfferData = (pageName: string, placement: string, adType: AdType) => {
    const page = offerData.pages.find((p: any) => p.name === pageName);
  
    if (!page) return null;
  
    if (adType === 'produit') {
      // If adType is 'produit', search in the 'product' array
      const productData = page.product.find((prod: any) => prod.title === placement);
      if (productData) {
        return {
          price: productData.price,
          duration: productData.duration,
          durationUnit: productData.durationUnit
        };
      }
    } else if (adType === 'megaHautSlide') {
      // If adType is 'megaHautSlide', check if the placement matches the megaHautSlide key
      if (page.megaHautSlide) {
        return {
          price: page.megaHautSlide.price,
          duration: page.megaHautSlide.duration,
          durationUnit: page.megaHautSlide.durationUnit
        };
      }
    }
  
    return null;
  };

  // Render offer cards
  return (
    <div>
      {generatedPagesAndPlacements.map(({ page, placements }) => (
        <div key={page}>
          {placements.map((placement: string, index: number) => {
            const offerDetails = findOfferData(page, placement, adType);  // Pass adType here
            if (offerDetails) {
              return (
                <CardOffer
                  key={index}
                  title={(page === 'Page d\'accueil' && placement==='Marché') ? `Marché ${myCompanyMarche} - Secteur ${myCompanySecteur}`: placement}
                  // Concatenate companySecteur for rendering, but keep lookup to 'Page secteur'
                  subtitle={page === 'Page Secteur' ? `${page} ${myCompanySecteur}` : page}
                  price={offerDetails.price.toString()}
                  priceUnit="DA"
                  duration={offerDetails.duration.toString()}
                  durationUnit={offerDetails.durationUnit}
                  svgPath="/svg/home.svg"  // Example path for SVG
                  placements="" // You can pass placements here if needed
                />
              );
            } else {
              return <div key={index}>No offer data for {placement} on {page}</div>;
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default Draft;


/* "use client";
import React, { useState, useEffect } from 'react';
import CardOffer from '../offer_card/page'
import Filter from '../filter/page'
import { useSelector } from 'react-redux';
function draft() {
  const [companyData, setCompanyData] = useState<any>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  //bring adType
  const adType = useSelector((state: any) => state.ad.currentAdType);
  console.log("hey from adType",adType)
  //fetching data 
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [companyResponse, offerResponse] = await Promise.all([
          fetch('/data/companyData.json'),
          fetch('/data/choose_offer.json')
        ]);

        if (!companyResponse.ok) throw new Error(`HTTP error! status: ${companyResponse.status}`);
        if (!offerResponse.ok) throw new Error(`HTTP error! status: ${offerResponse.status}`);

        const companyData = await companyResponse.json();
        const offerData = await offerResponse.json();

        setCompanyData(companyData);
        setOfferData(offerData);
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
  if (!companyData || !offerData) return <div>No data available</div>;

  const { company } = companyData;
  console.log("test company",company)
  console.log("test choose offer",offerData)
  const myCompanyType = company.Type
  const myCompanySecteur = company.selectedSectors
  const myCompanyMarche = company.selectedMarket
  console.log("COMPANYTYPE",myCompanyType)
  
type CompanyType = 'ordinaire' | 'startup' | 'artisanal';
type AdType = 'produit' | 'megHautSlide';
type CompanySecteur = 'Industrie'| 'Agriculture' | 'Construction' | 'ITech';
type CompanyMarche = 'algérien' | 'international';

interface PagePlacement {
  page: string;
  placements: string[];
}

// Function to generate pages and placements
function generatePagesAndPlacements(
  companyType: CompanyType,
  adType: AdType,
  companySecteur: CompanySecteur,
  companyMarche: CompanyMarche
): PagePlacement[] {
  const pages: PagePlacement[] = [];

  // Common pages for all company types
  const commonPages = ['Nouvel arrivage', 'Meilleurs produits', 'Soldes'];

  // Helper function to add a page with placements
  const addPage = (pageName: string, placements: string[]) => {
    pages.push({ page: pageName, placements });
  };

  // Page d'accueil (Home page)
  if (adType === 'produit') {
    const homePlacements = [...commonPages];
    if (companyType === 'ordinaire') {
      homePlacements.push(`Marché ${companyMarche} - Secteur ${companySecteur}`);
    } else if (companyType === 'startup') {
      homePlacements.push('Startup');
    } else if (companyType === 'artisanal') {
      homePlacements.push('Produit artisanal');
    }
    addPage("Page d'accueil", homePlacements);
  } else if (adType === 'megHautSlide') {
    addPage("Page d'accueil", ['Mega Haut Slide']);
  }

  // Specific pages based on company type
  if (companyType === 'ordinaire') {
    addPage(`Page secteur ${companySecteur}`, adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
  } else if (companyType === 'startup') {
    addPage('Page Startup', adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
  } else if (companyType === 'artisanal') {
    addPage('Page Produit artisanal', adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
  }

  // Common pages for all types
  commonPages.forEach(pageName => {
    addPage(`Page ${pageName}`, adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
  });

  return pages;
}
const result = generatePagesAndPlacements(myCompanyType, 'produit', myCompanySecteur, myCompanyMarche);
console.log(JSON.stringify(result, null, 2));

  return (
    <>
    
   {/*  <Filter
                title="Page désirée : "
                options=""
                selected=""
                onChange=""
                
            /> 
    <CardOffer
    title="Mega haut slide"
    subtitle="page d'acceuil"
    price="1000"
    priceUnit="da"
    duration="5"
    durationUnit="days"
    svgPath="/svg/home.svg"
    placements=""
    />
    </>
  )
}

export default draft */