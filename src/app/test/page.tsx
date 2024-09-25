import StaticColoredIllustration from '../components/dynamic_illustration/page';
import OfferCard from '../components/offer_card/page';
import ChooseOffer from '../components/choose_offer/page';
import ChooseOfferDraft from '../components/choose_offer/draft';
import PdInfo from '../components/product_info/page';
const placements = [
  { id: 'nv-arrivage', color: '#FF561C' },
  //{ id: 'background', color: '#F0F0F0' },
  // Add more placements as needed
];
import Stepper from '../stepper/page';
export default function OfferPage() {
  return (
    <>
    <PdInfo/>
    {/* <ChooseOfferDraft/> */}
    {/* <ChooseOffer 
      companyType="ordinaire"
      companyMarche="algérien"
      companySecteur="Construction"
      origineEntreprise="algérienne"
    /> */}
    {/* <ChooseOffer />
    <ChooseOffer companyType='Art' />
    <ChooseOffer companyType='Startup' /> */}
    <Stepper/>
    {/* <OfferCard
    title="Nouveau Arrivage"
    subtitle="Page d'accueil  - Produit sponsorisé"
    price={72.5}
    svgPath="/svg/home.svg"
    placements={[
    { id: 'soldes', color: '#FF561C' },
    // Add more placements as needed
  ]}
/> */}
    
     </> 
  );
}