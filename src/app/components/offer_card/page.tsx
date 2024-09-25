import React from 'react'
import { useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import StaticColoredIllustration from '../dynamic_illustration/page';
import { setSelectedOffer } from '../features/offer/offerSlice'; 

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
  const dispatch = useDispatch();

  const handleGetNow = () => {
    dispatch(setSelectedOffer({
      title,
      subtitle,
      price,
      priceUnit,
      duration,
      durationUnit,
      svgPath,
      placements
    }));
  };

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
        <button className="btn" onClick={handleGetNow}>Get now</button>
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