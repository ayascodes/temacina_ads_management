import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import  OfferCard  from '../offer_card/page'; // Assuming OfferCard is in the same directory

// You'll need to import or define these types
// import { CompanyType, Marche, Secteur } from './types';
    type companyType: 'ordinaire' | 'artisanal' | 'startup';
    type companyMarche: 'algérien' | 'international';
    type companySecteur: 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
    type origineEntreprise: 'algérienne' | 'internationale';
const getPlacementId = (
  placementType: string,
  companyType: companyType,
  companyMarche: companyMarche,
  companySecteur: companySecteur,
  offerData: any
): string => {
  switch (placementType) {
    case "Mega Haut Slide":
      return "mega_haut_slide";
    case "Nouvel arrivage":
      return "nv-arrivage";
    case "Meilleurs produits":
      return "mr-produits";
    case "Soldes":
      return "soldes";
    case "LeMarché":
      return `${offerData.marcheMap[companyMarche]}-${offerData.secteurMap[companySecteur]}`;
    case "Produit artisanal":
      return `pa-${offerData.marcheMap[companyMarche]}`;
    case "Startup":
      return `st-${offerData.secteurMap[companySecteur]}`;
    case "Plein page":
      if (companyType === 'ordinaire') {
        return offerData.secteurMap[companySecteur];
      }
      return "plein-page";
    default:
      return "unknown";
  }
};

const OfferCardsGenerator: React.FC<{
  currentPage: string;
}> = ({ currentPage }) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const adType = useSelector((state: any) => state.ad.currentAdType);

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

  const getOfferData = (placement: string) => {
    const placementId = getPlacementId(placement, company.type, company.marche, company.secteur, offerData);
    return offerData[company.type][adType][placementId];
  };

  const getPlacements = () => {
    if (adType === 'megHautSlide') return ['Mega Haut Slide'];

    switch (currentPage) {
      case "Page d'accueil":
        if (company.type === 'ordinaire') {
          return ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'LeMarché'];
        } else if (company.type === 'startup') {
          return ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'Startup'];
        } else if (company.type === 'artisanal') {
          return ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'Produit artisanal'];
        }
        break;
      case "Page secteur":
      case "Page Startup":
      case "Page Produit artisanal":
      case "Page Nouvel arrivage":
      case "Page Meilleurs produits":
      case "Page Soldes":
        return ['Plein page'];
      default:
        return [];
    }
  };

  const placements = getPlacements();

  return (
    <>
      {placements.map((placement) => {
        const data = getOfferData(placement);
        return (
          <OfferCard
            key={placement}
            title={placement}
            subtitle={currentPage}
            price={data.price}
            priceUnit={company.type === 'ordinaire' ? 'USD' : 'EUR'}
            duration={data.duration}
            durationUnit={data.durationUnit}
            svgPath={currentPage === "Page d'accueil" ? "/svg/home.svg" : "/svg/plein.svg"}
            placements={[getPlacementId(placement, company.type, company.marche, company.secteur, offerData)]}
          />
        );
      })}
    </>
  );
};

export default OfferCardsGenerator;