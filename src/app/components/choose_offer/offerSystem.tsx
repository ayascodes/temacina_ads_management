// File: components/choose_offer/offerSystem.ts
import OfferCard from "../offer_card/page";
type CompanyType = 'ordinaire' | 'artisanal' | 'startup';
type Marche = 'algérien' | 'international';
type Secteur = 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
type OrigineDeLEntreprise = 'algérienne' | 'internationale';

interface Placement {
  id: string;
  title: string;
  price: number;
  duration: number;
  subtitle?: string; // Added subtitle type here
  durationUnit?: string; // Added durationUnit type here
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
  "Industrie": "#535553", // Example color for Industrie
  "Agriculture": "#94EA7E", // Example color for Agriculture
  "Construction": "#FED61E", // Example color for Construction
  "ITech": "#66CEEE", // Example color for ITech
};

const getPlacementId = (
  placementType: string,
  companyType: CompanyType,
  companyMarche: Marche,
  companySecteur: Secteur
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
      return `st-${secteurMap[companySecteur]}`; // Use only sector for startups
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
  origineEntreprise: OrigineDeLEntreprise
): PageOffer[] => {
  const priceUnit = getPriceUnit(origineEntreprise);
  const durationUnit = 'jours'; // Assuming the unit is always 'jours' for simplicity
  
  const commonPlacements = [
    { id: getPlacementId("Nouvel arrivage", companyType, companyMarche, companySecteur), title: "Nouvel arrivage", price: 1000, duration: 7, durationUnit },
    { id: getPlacementId("Meilleurs produits", companyType, companyMarche, companySecteur), title: "Meilleurs produits", price: 1200, duration: 7, durationUnit },
    { id: getPlacementId("Soldes", companyType, companyMarche, companySecteur), title: "Soldes", price: 1500, duration: 14, durationUnit },
  ];

  const pageOffers: PageOffer[] = [
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

  if (companyType === 'ordinaire') {
    const sectorColor = secteurColorMap[companySecteur];
    pageOffers[0].placements.push({
      id: getPlacementId("LeMarché", companyType, companyMarche, companySecteur),
      title: `Marché ${companyMarche} - secteur ${companySecteur}`, // Dynamic title
      price: 2000,
      duration: 30,
      durationUnit
    });
    
    pageOffers.push({
      page: "Page Secteur",
      svgPath: "/svg/plein.svg",
      placements: [{
        id: getPlacementId("Secteur", companyType, companyMarche, companySecteur),
        title: "Plein page", // Title remains "Plein page"
        subtitle: `Page secteur ${companySecteur}`, // Dynamic subtitle
        price: 2800,
        duration: 30,
        durationUnit,
        color: sectorColor, // Pass the color for the sector
        rectangleIds: ['sec1', 'sec2', 'sec3', 'sec4'] // Add rectangle IDs here
      }]
    });

  } else if (companyType === 'artisanal') {
    pageOffers[0].placements.push({
      id: getPlacementId("Produit artisanal", companyType, companyMarche, companySecteur),
      title: "Produit artisanal",
      price: 1800,
      duration: 30,
      durationUnit
    });

    pageOffers.push({
      page: "Page Produit artisanal",
      svgPath: "/svg/plein.svg",
      placements: [{
        id: getPlacementId("Produit artisanal", companyType, companyMarche, companySecteur),
        title: "Plein page",
        subtitle: "Page Produit artisanal",
        price: 2500,
        duration: 30,
        durationUnit
      }]
    });

  } else if (companyType === 'startup') {
    pageOffers[0].placements.push({
      id: getPlacementId("Startup", companyType, companyMarche, companySecteur),
      title: "Startup",
      price: 1600,
      duration: 30,
      durationUnit
    });

    pageOffers.push({
      page: "Page Startup",
      svgPath: "/svg/plein.svg",
      placements: [{
        id: getPlacementId("Startup", companyType, companyMarche, companySecteur),
        title: "Plein page",
        subtitle: "Page Startup",
        price: 2200,
        duration: 30,
        durationUnit
      }]
    });
  }

  return pageOffers;
};

export const generateOfferCards = (
  companyType: CompanyType,
  companyMarche: Marche,
  companySecteur: Secteur,
  origineEntreprise: OrigineDeLEntreprise
): JSX.Element[] => {
  const pageOffers = getPageOffers(companyType, companyMarche, companySecteur, origineEntreprise);

  return pageOffers.flatMap(pageOffer => 
    pageOffer.placements.map(placement => {
      const placementsArray = pageOffer.page === "Page Secteur" && companyType === 'ordinaire'
        ? placement.rectangleIds.map(id => ({ id, color: placement.color }))
        : [{ id: placement.id, color: '#FF561C' }];

      if (placement.title.includes("Plein page")) {
        placementsArray.push({ id: 'plein', color: '#FF561C' });
      }

      return (
        <OfferCard
          key={`${pageOffer.page}-${placement.id}`}
          title={placement.title}
          subtitle={placement.subtitle || pageOffer.page}
          price={placement.price}
          priceUnit={getPriceUnit(origineEntreprise)}
          duration={placement.duration}
          durationUnit={placement.durationUnit || 'jours'}
          svgPath={pageOffer.svgPath}
          placements={placementsArray}
        />
      );
    })
  );
};