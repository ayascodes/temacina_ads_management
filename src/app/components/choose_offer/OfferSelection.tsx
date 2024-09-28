"use client";
import React, { useState, useEffect } from 'react';
import CardOffer from '../offer_card/page';
import { useSelector } from 'react-redux';
import Filtre from '../filter/page'; 
import { getPlacements } from './placementGen';

function OfferSelection() {
  const [companyData, setCompanyData] = useState<any>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredPages, setFilteredPages] = useState<string[]>([]);

  interface PagePlacement {
    page: string;
    placements: string[];
  }

  // Get adType from Redux store
  const adType = useSelector((state: any) => state.ad.currentAdType);
  console.log("hey from offerSelection" , adType);
  type CompanyType = 'ordinaire' | 'startup' | 'artisanal';
  type AdType = 'produit' | 'megaHautSlide';
  type CompanySecteur = 'Industrie'| 'Agriculture' | 'Construction' | 'ITech';
  type CompanyMarche = 'algérien' | 'international';
  type OrigineDeLEntreprise = 'algérienne' | 'internationale';
  
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
  const myCompanyOrigine = company.origin;

  //getPriceUnit
  const getPriceUnit = (origine: OrigineDeLEntreprise): string => {
    return origine === 'algérienne' ? 'DZD' : 'USD';
  };
  

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
   // Get all unique pages for the Filtre component
   const allPages = Array.from(new Set(generatedPagesAndPlacements.map(item => item.page)));

   // Handle filter changes
   const handleFilterChange = (selected: string[]) => {
     setFilteredPages(selected);
   };
 
   // Filter the generatedPagesAndPlacements based on the selected pages
   const filteredPagesAndPlacements = filteredPages.length > 0
     ? generatedPagesAndPlacements.filter(item => filteredPages.includes(item.page))
     : generatedPagesAndPlacements;
 
   return (
     <div >
      {/* <Image src="/svg/home.svg" alt="My Icon" width={400} height={400} /> */}
       <Filtre
         title="Page désirée : "
         options={allPages}
         selected={filteredPages}
         onChange={setFilteredPages}
       />
       <div className="offer-cards-container">
       {filteredPagesAndPlacements.map(({ page, placements }) => (
         <div key={page} >
           {placements.map((placement: string, index: number) => {
             const offerDetails = findOfferData(page, placement, adType);
             const title= (page === 'Page d\'accueil' && placement==='Marché') ? `Marché ${myCompanyMarche} - Secteur ${myCompanySecteur}`: placement
             const subtitle = page === 'Page Secteur' ? `${page} ${myCompanySecteur}` : page
             const svgPath = page === 'Page d\'accueil' ? `/svg/home.svg` : `/svg/plein.svg`
             const placements = getPlacements(title,subtitle,myCompanySecteur,myCompanyMarche)
             if (offerDetails) {
               return (
                 <CardOffer
                   key={index}
                   title={title}
                   subtitle={subtitle}
                   price={offerDetails.price.toString()}
                   priceUnit={getPriceUnit(myCompanyOrigine)}
                   duration={offerDetails.duration.toString()}
                   durationUnit={offerDetails.durationUnit}
                   svgPath={svgPath}
                   placements={placements}
                 />
               );
             } else {
               return <div key={index}>No offer data for {placement} on {page}</div>;
             }
           })}
         </div>
       ))}
     </div>
     </div>
   );
 }
 
 export default OfferSelection;