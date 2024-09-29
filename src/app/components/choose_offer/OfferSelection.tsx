import React, { useState, useEffect } from 'react';
import CardOffer from '../offer_card/page';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Filtre from '../filter/page'; 
import { getPlacements } from './placementGen';

function OfferSelection() {
  const [companyData, setCompanyData] = useState<any>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredPages, setFilteredPages] = useState<string[]>([]);
  /* const [generatedPagesAndPlacements, setGeneratedPagesAndPlacements] = useState<PagePlacement[]>([]); */
  /* const [sectorPages, setSectorPages] = useState<{ page: string; sector: CompanySecteur }[]>([]); */

  // Get adType from Redux store
  const adType = useSelector((state: any) => state.ad.currentAdType);
  const selectedProductId = useSelector((state: RootState) => state.product.selectedProductId);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductSector, setSelectedProductSector] = useState<CompanySecteur | null>(null);

  // Fetch company and offer data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [companyResponse, offerResponse, productsResponse] = await Promise.all([
          fetch('/data/companyData.json'),
          fetch('/data/choose_offer.json'),
          fetch('/data/products.json')
        ]);

        if (!companyResponse.ok || !offerResponse.ok || !productsResponse.ok) {
          throw new Error(`HTTP error! status: ${companyResponse.status}`);
        }

        const companyData = await companyResponse.json();
        const offerData = await offerResponse.json();
        const productsData = await productsResponse.json();

        setCompanyData(companyData);
        setOfferData(offerData);
        setProducts(productsData);
      } catch (e) {
        setError(`Failed to fetch data: ${e instanceof Error ? e.message : String(e)}`);
        console.error('Error fetching data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selectedProductSector when selectedProductId changes
  useEffect(() => {
    const product = products.find(p => p.id === selectedProductId);
    setSelectedProductSector(product ? product.secteur : null);
  }, [selectedProductId, products]);

  // Generate pages and placements
  useEffect(() => {
    if (!companyData || !adType) return;

    const { company } = companyData;
    const generatePagesAndPlacements = (): PagePlacement[] => {
      const pages: PagePlacement[] = [];
      const newSectorPages: { page: string; sector: CompanySecteur }[] = [];
      const commonPages = ['Nouvel arrivage', 'Meilleurs produits', 'Soldes'];

      const addPage = (pageName: string, placements: string[]) => {
        pages.push({ page: pageName, placements });
      };

      // Handle Page d'accueil
      if (adType === 'produit') {
        const homePlacements = [...commonPages];
        if (company.Type === 'ordinaire') {
          homePlacements.push(`Marché`);
        } else if (company.Type === 'startup') {
          homePlacements.push('Startup');
        } else if (company.Type === 'artisanal') {
          homePlacements.push('Produit artisanal');
        }
        addPage("Page d'accueil", homePlacements);
      } else if (adType === 'megaHautSlide') {
        addPage("Page d'accueil", ['Mega Haut Slide']);
      }

      // Handle Page Secteur
      if (adType === 'megaHautSlide') {
        company.selectedSectors.forEach((sector: CompanySecteur) => {
          addPage("Page Secteur", ['Mega Haut Slide']);
          newSectorPages.push({ page: "Page Secteur", sector });
        });
      } else if (adType === 'produit' && selectedProductSector) {
        addPage("Page Secteur", ['Plein page']);
        newSectorPages.push({ page: "Page Secteur", sector: selectedProductSector });
      }

      // Add common pages
      commonPages.forEach(pageName => {
        addPage(`Page ${pageName}`, adType === 'produit' ? ['Plein page'] : ['Mega Haut Slide']);
      });

      setSectorPages(newSectorPages);
      return pages;
    };

    const generatedPages = generatePagesAndPlacements();
    setGeneratedPagesAndPlacements(generatedPages);
  }, [companyData, adType, selectedProductSector]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!companyData || !offerData) return <div>No data available</div>;

  const { company } = companyData;

  // Function to find the corresponding product for a given page and placement
  const findOfferData = (pageName: string, placement: string, adType: AdType) => {
    const page = offerData.pages.find((p: any) => p.name === pageName);
    if (!page) return null;
  
    if (adType === 'produit') {
      const productData = page.product.find((prod: any) => prod.title === placement);
      if (productData) {
        return {
          price: productData.price,
          duration: productData.duration,
          durationUnit: productData.durationUnit
        };
      }
    } else if (adType === 'megaHautSlide' && page.megaHautSlide) {
      return {
        price: page.megaHautSlide.price,
        duration: page.megaHautSlide.duration,
        durationUnit: page.megaHautSlide.durationUnit
      };
    }
  
    return null;
  };

  const getPriceUnit = (origine: OrigineDeLEntreprise): string => {
    return origine === 'algérienne' ? 'DZD' : 'USD';
  };

  // Get all unique pages for the Filtre component
  const allPages = Array.from(new Set(generatedPagesAndPlacements.map(item => item.page)));

  // Filter the generatedPagesAndPlacements based on the selected pages
  const filteredPagesAndPlacements = filteredPages.length > 0
    ? generatedPagesAndPlacements.filter(item => filteredPages.includes(item.page))
    : generatedPagesAndPlacements;
return (
    <div>
      <Filtre
        title="Page désirée : "
        options={allPages}
        selected={filteredPages}
        onChange={setFilteredPages}
      />
      <div className="offer-cards-container">
      {filteredPagesAndPlacements.map(({ page, placements }, pageIndex) => (
        placements.map((placement: string, index: number) => {
          const offerDetails = findOfferData(page, placement, adType);
          let title = (page === "Page d'accueil" && placement === 'Marché') 
            ? `Marché ${company.selectedMarket} - Secteur ${adType === 'produit' ? selectedProductSector : company.selectedSectors.join(', ')}`
            : placement;
          let subtitle = page;
          
          // Handle sector information for "Page Secteur"
          if (page === "Page Secteur") {
            const sectorPage = sectorPages.find((sp, idx) => idx === pageIndex);
            if (sectorPage) {
              subtitle = `${page} ${sectorPage.sector}`;
            }
          }
          
          const svgPath = page === "Page d'accueil" ? `/svg/home.svg` : `/svg/plein.svg`;
          const placementsData = getPlacements(title, subtitle, adType === 'produit' ? selectedProductSector : company.selectedSectors[0], company.selectedMarket);

          if (offerDetails) {
            return (
              <CardOffer
                key={`${page}-${pageIndex}-${index}`}
                title={title}
                subtitle={subtitle}
                price={offerDetails.price.toString()}
                priceUnit={getPriceUnit(company.origin)}
                duration={offerDetails.duration.toString()}
                durationUnit={offerDetails.durationUnit}
                svgPath={svgPath}
                placements={placementsData}
              />
            );
          } else {
            return <div key={`${page}-${pageIndex}-${index}`}>No offer data for {placement} on {page}</div>;
          }
        })
      ))}
      </div>
    </div>
  );
}

export default OfferSelection;