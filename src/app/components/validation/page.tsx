import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust the import path as needed
import AdTable from '../AdTable/AdTable';

const NextStepComponent: React.FC = () => {
  // Select the ads from the Redux store
  const ads = useSelector((state: RootState) => state.ad.ads);

  return (
    <div>
      <h2>Your Ads</h2>
      {ads.length === 0 ? (
        <p>No ads created yet.</p>
      ) : (
        <div>
      <h1>Ad List</h1>
      <AdTable ads={ads} />
    </div>
      )}
    </div>
  );
};

export default NextStepComponent;
