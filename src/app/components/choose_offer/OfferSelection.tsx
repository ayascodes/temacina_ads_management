
"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Filter from '../filter/page';
import OfferCard from '../offer_card/page';

// Types
type CompanyType = 'ordinaire' | 'artisanal' | 'startup';
type CompanyMarche = 'algérien' | 'international';
type CompanySecteur = 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
type OrigineDeLEntreprise = 'algérienne' | 'internationale';
type AdType = 'produit' | 'megaHautSlide';

interface CompanyData {
  sectors: CompanySecteur[];
  markets: CompanyMarche[];
  currencies: string[];
  companyTypes: CompanyType[];
  company: {
    Type: CompanyType;
    name: string;
    description: string;
    selectedSectors: CompanySecteur[];
    selectedMarket: CompanyMarche;
    selectedCurrency: string;
    origin: OrigineDeLEntreprise;
  };
}

interface OfferData {
  pages: {
    name: string;
    productAds: {
      title: string;
      price: number;
      duration: number;
      durationUnit: string;
    }[];
    megaHautSlide: {
      price: number;
      duration: number;
      durationUnit: string;
    };
  }[];
  marcheMap: Record<CompanyMarche, string>;
  secteurMap: Record<CompanySecteur, string>;
}

// Utility functions
const getPlacementId = (
  placementType: string,
  companyType: CompanyType,
  companyMarche: CompanyMarche,
  companySecteur: CompanySecteur,
  offerData: OfferData
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

const getPriceUnit = (origine: OrigineDeLEntreprise): string => {
  return origine === 'algérienne' ? 'DZD' : 'USD';
};

const OfferSelection: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [offerData, setOfferData] = useState<OfferData | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  
  // Get adType from Redux store
  const adType = useSelector((state: any) => state.adType);

  useEffect(() => {
    // Fetch company data
    fetch('/data/companyData.json')
      .then(res => res.json())
      .then(data => setCompanyData(data));

    // Fetch offer data
    fetch('/choose_offer.json')
      .then(res => res.json())
      .then(data => setOfferData(data));
  }, []);

  if (!companyData || !offerData) return <div>Loading...</div>;

  const { company } = companyData;
  const pageOptions = offerData.pages.map((page) => page.name);

  const handlePageChange = (selected: string[]) => {
    setSelectedPages(selected);
  };

  const getAvailableOffers = () => {
    let availableOffers = offerData.pages.flatMap((page) => {
      if (selectedPages.length > 0 && !selectedPages.includes(page.name)) {
        return [];
      }

      const offers = [];

      if (adType === 'produit') {
        offers.push(...page.productAds.map((ad) => ({ ...ad, page: page.name })));
      } else if (adType === 'megaHautSlide') {
        offers.push({ ...page.megaHautSlide, title: 'Mega Haut Slide', page: page.name });
      }

      return offers;
    });

    // Filter offers based on company type
    const offerTypeMap = {
      ordinaire: ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'Plein page', 'Mega Haut Slide'],
      startup: ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'Startup', 'Plein page', 'Mega Haut Slide'],
      artisanal: ['Nouvel arrivage', 'Meilleurs produits', 'Soldes', 'Produit artisanal', 'Plein page', 'Mega Haut Slide']
    };

    return availableOffers.filter((offer) =>
      offerTypeMap[company.Type as keyof typeof offerTypeMap].includes(offer.title)
    );
  };

  const availableOffers = getAvailableOffers();

  return (
    <div>
      <h1>Offer Selection</h1>
      <Filter
        title="Page désirée : "
        options={pageOptions}
        selected={selectedPages}
        onChange={handlePageChange}
      />
      <div className="offer-cards">
        {availableOffers.map((offer, index) => {
          const placementId = getPlacementId(offer.title, company.Type, company.selectedMarket, company.selectedSectors[0], offerData);
          const placementsArray =
            offer.page === "Page Secteur" && company.Type === 'ordinaire'
              ? ['sec1', 'sec2', 'sec3', 'sec4'].map(id => ({ id, color: '#FF561C' }))
              : [{ id: placementId, color: '#FF561C' }];

          return (
            <OfferCard
              key={index}
              title={offer.title}
              subtitle={offer.page}
              price={offer.price}
              priceUnit={getPriceUnit(company.origin)}
              duration={offer.duration}
              durationUnit={offer.durationUnit}
              svgPath={offer.page === "Page d'accueil" ? "/svg/home.svg" : "/svg/plein.svg"}
              placements={placementsArray}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OfferSelection;