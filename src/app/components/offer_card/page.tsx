import React from 'react'
import Container from '@mui/material/Container';
import StaticColoredIllustration from '../dynamic_illustration/page';
import Btn from '../btn/page';
function OfferCard({
  title,
  subtitle,
  price,
  priceUnit,
  duration,
  durationUnit,
  svgPath,
  placements
}) {
  return (
    <Container className="offerCard">
      <div className="offerCardp1">
        <div className="text">
          <h2>{title}</h2>
          <h4>{subtitle}</h4>
        </div>
        <div className="price">
          <h1>{price} {priceUnit}</h1>
          <h5>{duration} {durationUnit}</h5>
        </div>
        <Btn />
      </div>
      <div className="offerCardp2">
        <StaticColoredIllustration 
          svgPath={svgPath} 
          placements={placements} 
        />
      </div>
    </Container>
  )
}

export default OfferCard

{/* <OfferCard
    title="Nouveau Arrivage"
    subtitle="Page d'accueil  - Produit sponsorisé"
    price={72.5}
    svgPath="/svg/home.svg"
    placements={[
    { id: 'nv-arrivage', color: '#FF561C' },
    // Add more placements as needed
  ]}
/> */}