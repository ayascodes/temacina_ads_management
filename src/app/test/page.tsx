import StaticColoredIllustration from '../../components/dynamic_illustration/page';
import OfferCard from '../../components/offer_card/page';
import ChooseOffer from '../../components/choose_offer/page';
import ChooseOfferDraft from '../../components/choose_offer/draft';
import PdInfo from '../../product_info/page';
import { Container, Typography, Paper, Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
const placements = [
  { id: 'nv-arrivage', color: '#FF561C' },
  //{ id: 'background', color: '#F0F0F0' },
  // Add more placements as needed
];
import Stepper from '../../stepper/page';
export default function OfferPage() {
  const product = {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum dignissimos, neque magnam excepturi natus, hic eligendi',
    name: 'Produit Test',
    secteur: 'Industrie',
    categorie: 'Électronique',
    sousCategorie: 'Appareils',
    marcheVise: 'algerien',
    prix: '1000 DA',
    quantite: '80',
    status: 'Disponible',
  };
  return (
    <>
    <div className="marketin_visual_title">
      <h1>Marketing Visuel  DA TTC/Jour</h1>
    </div>
    <Container className="productInfoContainer" maxWidth="lg">
      <Paper className="paper" elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <h1>
          Publicité Du Produit <span className='highlight'>{product.name}</span>
        </h1>
        <div className='part'>
            <div className="partone">
              <Image src="/logooo.png" alt="Company logo" width={400} height={600} />
            </div>

            <div className="parttwo">
                <div className="cardLine">
                  <h3>Nom du produit :</h3>
                  <p>{product.name}</p>
                </div>
                <div>
                  <h3>Description :</h3>
                  <p>{product.description}</p>
                </div>
                <div className="cardLine">
                  <h3>Secteur :</h3>
                  <p>{product.secteur}</p>
                </div>
                <div className="cardLine">
                  <h3>Categorie :</h3>
                  <p>{product.categorie}</p>
                </div>
                <div className="cardLine">
                  <h3>Sous categorie :</h3>
                  <p>{product.sousCategorie}</p>
                </div>
                <div className="cardLine">
                  <h3>Marché visé   :</h3>
                  <p>{product.marcheVise}</p>
                </div>
                <div className="cardLine">
                  <h3>Prix   :</h3>
                  <p>{product.prix}</p>
                </div>
                <div className="cardLine">
                  <h3>Quantité   :</h3>
                  <p>{product.quantite}</p>
                </div>
              </div>
          </div>
      </Paper>
    </Container>
    <div className="btnContainer">
        <button className="backBtn">
          <Link href="/" passHref>
            <a>Retour</a> {/* Explicit <a> tag */}
          </Link>
        </button>
    
        <button className="nextBtn">
          <Link href="/stepper" passHref>
            <a>Commencer</a> {/* Explicit <a> tag */}
          </Link>
        </button>
  </div>
  </>
);
      }
        {/* <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Name:</Typography>
            <Typography variant="body1">{product.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Sector:</Typography>
            <Typography variant="body1">{product.secteur}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Category:</Typography>
            <Typography variant="body1">{product.categorie}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Subcategory:</Typography>
            <Typography variant="body1">{product.sousCategorie}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Price:</Typography>
            <Typography variant="body1">{product.prix}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Status:</Typography>
            <Typography variant="body1">{product.status}</Typography>
          </Grid>
        </Grid> */}
    {/* <PdInfo/> */}
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
    {/* <Stepper/> */}
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