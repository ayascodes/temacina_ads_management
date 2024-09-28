// Function to generate placements based on provided parameters
type Secteur = 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
type Marche = 'algérien' | 'international';

export const getPlacements = (title: string, subtitle: string, myCompanySecteur: Secteur, myCompanyMarche: Marche) => {
  const placements = [];

  const secteurColorMap: { [key in Secteur]: string } = {
    "Industrie": "#535553", // Example color for Industrie
    "Agriculture": "#94EA7E", // Example color for Agriculture
    "Construction": "#FED61E", // Example color for Construction
    "ITech": "#66CEEE", // Example color for ITech
  };

  const marcheMap: { [key in Marche]: string } = {
    'algérien': 'alg',
    'international': 'int',
  };

  const secteurMap: { [key in Secteur]: string } = {
    "Industrie": "ind",
    "Agriculture": "agr",
    "Construction": "con",
    "ITech": "tech",
  };

  // Function to get placement ID based on title, marche, and secteur
  const getPlacementId = (companyMarche: Marche, companySecteur: Secteur): string => {
    switch (true) {
      case title === "Nouvel arrivage":
        return "nv-arrivage";
      case title === "Meilleurs produits":
        return "mr-produits";
      case title === "Soldes":
        return "soldes";
      case title.substring(0, 6) === "Marché":
        return `${marcheMap[companyMarche]}-${secteurMap[companySecteur]}`;
      case title === "Produit artisanal":
        return `pa-${marcheMap[companyMarche]}`;
      case title === "Startup":
        return `st-${secteurMap[companySecteur]}`; // Use only sector for startups
      case title === "Mega Haut Slide":
        return "mega_haut_slide";
      case title === "Plein page":
        return "plein"; 
      default:
        return "unknown";
    }
  };

  // Default placement with color #FF561C
  placements.push({
    id: getPlacementId(myCompanyMarche, myCompanySecteur),
    color: '#FF561C',
  });

  // If the subtitle contains "Page Secteur", add 4 more placements with the same color from secteurColorMap
  if (subtitle.includes("Page Secteur")) {
    const secteurColor = secteurColorMap[myCompanySecteur];

    placements.push(
      { id: 'sec1', color: secteurColor },
      { id: 'sec2', color: secteurColor },
      { id: 'sec3', color: secteurColor },
      { id: 'sec4', color: secteurColor }
    );
  }

  return placements;
};
