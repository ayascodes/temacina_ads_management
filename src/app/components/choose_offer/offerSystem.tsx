"use client";
// File: components/choose_offer/offerSystem.ts
import OfferCard from "../offer_card/page";
import { useSelector } from 'react-redux'; 
import { RootState } from '../redux/store'; // Adjust this import based on your actual setup

type CompanyType = 'ordinaire' | 'artisanal' | 'startup';
type Marche = 'algérien' | 'international';
type Secteur = 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
type OrigineDeLEntreprise = 'algérienne' | 'internationale';
type AdType = 'product' | 'megaHautSlide';

interface Placement {
  id: string;
  title: string;
  price: number;
  duration: number;
  subtitle?: string; 
  durationUnit?: string; 
}

interface PageOffer {
  page: string;
  svgPath: string;
  placements: Placement[];
}

const marcheMap: { [key in Marche]: string } = {
  'algérien': 'alg',
  'international': 'int'
};

const secteurMap: { [key in Secteur]: string } = {
  "Industrie": "ind",
  "Agriculture": "agr",
  "Construction": "con",
  "ITech": "tech"
};

const secteurColorMap: { [key in Secteur]: string } = {
  "Industrie": "#535553",
  "Agriculture": "#94EA7E",
  "Construction": "#FED61E",
  "ITech": "#66CEEE",
};

const getPlacementId = (
  placementType: string,
  companyType: CompanyType,
  companyMarche: Marche,
  companySecteur: Secteur,
  adType: AdType
): string => {
  switch (placementType) {
    case "Nouvel arrivage":
      return "nv-arrivage";
    case "Meilleurs produits":
      return "mr-produits";
    case "Soldes":
      return "soldes";
    case "LeMarché":
      return `${marcheMap[companyMarche]}-${secteurMap[companySecteur]}`;
    case "Produit artisanal":
      return `pa-${marcheMap[companyMarche]}`;
    case "Startup":
      return `st-${secteurMap[companySecteur]}`;
    case "Secteur":
      return secteurMap[companySecteur];
    default:
      return "unknown";
  }
};

const getPriceUnit = (origine: OrigineDeLEntreprise): string => {
  return origine === 'algérienne' ? 'DZD' : 'USD';
};

const getPageOffers = (
  companyType: CompanyType,
  companyMarche: Marche,
  companySecteur: Secteur,
  origineEntreprise: OrigineDeLEntreprise,
  adType: AdType
): PageOffer[] => {
  const priceUnit = getPriceUnit(origineEntreprise);
  const durationUnit = 'jours';

  // Mega Haut Slide logic: single placement for each page
  if (adType === 'megaHautSlide') {
    const megaHautSlidePlacement = { id: 'mega-haut-slide', title: "Mega Haut Slide", price: 5000, duration: 30, durationUnit };

    return [
      {
        page: "Page d'accueil",
        svgPath: "/svg/home.svg",
        placements: [megaHautSlidePlacement]
      },
      {
        page: "Page Nouvel arrivage",
        svgPath: "/svg/plein.svg",
        placements: [megaHautSlidePlacement]
      },
      {
        page: "Page Meilleurs produits",
        svgPath: "/svg/plein.svg",
        placements: [megaHautSlidePlacement]
      },
      {
        page: "Page Soldes",
        svgPath: "/svg/plein.svg",
        placements: [megaHautSlidePlacement]
      }
    ];
  }

  // Regular placements for adType 'product'
  const commonPlacements = [
    { id: getPlacementId("Nouvel arrivage", companyType, companyMarche, companySecteur, adType), title: "Nouvel arrivage", price: 1000, duration: 7, durationUnit },
    { id: getPlacementId("Meilleurs produits", companyType, companyMarche, companySecteur, adType), title: "Meilleurs produits", price: 1200, duration: 7, durationUnit },
    { id: getPlacementId("Soldes", companyType, companyMarche, companySecteur, adType), title: "Soldes", price: 1500, duration: 14, durationUnit },
  ];

  return [
    {
      page: "Page d'accueil",
      svgPath: "/svg/home.svg",
      placements: [...commonPlacements]
    },
    {
      page: "Page Nouvel arrivage",
      svgPath: "/svg/plein.svg",
      placements: [{ id: "plein-page", title: "Plein page", price: 3000, duration: 30, durationUnit }]
    },
    {
      page: "Page Meilleurs produits",
      svgPath: "/svg/plein.svg",
      placements: [{ id: "plein-page", title: "Plein page", price: 3200, duration: 30, durationUnit }]
    },
    {
      page: "Page Soldes",
      svgPath: "/svg/plein.svg",
      placements: [{ id: "plein-page", title: "Plein page", price: 3500, duration: 14, durationUnit }]
    },
  ];
};

// Updated generateOfferCards function
export const generateOfferCards = (
  companyType: CompanyType,
  companyMarche: Marche,
  companySecteur: Secteur,
  origineEntreprise: OrigineDeLEntreprise,
  adType: AdType
): JSX.Element[] => {
  const pageOffers = getPageOffers(companyType, companyMarche, companySecteur, origineEntreprise, adType);

  return pageOffers.flatMap(pageOffer => 
    pageOffer.placements.map(placement => (
      <OfferCard
        key={`${pageOffer.page}-${placement.id}`}
        title={placement.title}
        subtitle={pageOffer.page}
        price={placement.price}
        priceUnit={getPriceUnit(origineEntreprise)}
        duration={placement.duration}
        durationUnit={placement.durationUnit || 'jours'}
        svgPath={pageOffer.svgPath}
        placements={[{ id: placement.id, color: adType === 'megaHautSlide' ? '#FF561C' : secteurColorMap[companySecteur] }]}
      />
    ))
  );
};
