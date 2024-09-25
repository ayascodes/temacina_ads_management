import React from 'react';
import { generateOfferCards } from './offerSystem';

const OfferPage: React.FC = () => {
  const offerCards = generateOfferCards('ordinaire', 'algérien', 'Construction', 'international');

  return (
    <div>
      <h1>Offres disponibles</h1>
      {offerCards}
    </div>
  );
};

export default OfferPage;