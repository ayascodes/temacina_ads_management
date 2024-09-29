import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust the import path as needed
import AdTable from '../AdTable/AdTable';
import Filtre from '../filter/page'; // Import the Filtre component

interface Ad {
  status: string;
  type_de_publicite: string;
  // Add other properties as needed
}

const AdList: React.FC = () => {
  const ads = useSelector((state: RootState) => state.ad.ads);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const statusOptions = ['Approved', 'Pending', 'Rejected', 'Expired'];
  const typeOptions = ['Mega Haut Slide', 'Product'];

  const filteredAds = ads.filter((ad: Ad) => {
    const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(ad.status);
    const adType = ad.type_de_publicite.split(':')[0].trim();
    const typeMatch = selectedType.length === 0 || 
      (adType === 'Mega Haut Slide' && selectedType.includes('Mega Haut Slide')) ||
      (adType !== 'Mega Haut Slide' && selectedType.includes('Product'));
    return statusMatch && typeMatch;
  });

  return (
    <div className="ad-list p-4">
      <h1>Gérez vos annonces ici</h1>
      
      <Filtre
        title="Status "
        options={statusOptions}
        selected={selectedStatus}
        onChange={setSelectedStatus}
      />
      <Filtre
        title="Type "
        options={typeOptions}
        selected={selectedType}
        onChange={setSelectedType}
      />

      {filteredAds.length === 0 ? (
        <p className="no-ads-message text-gray-500">No ads match the selected filters.</p>
      ) : (
        <AdTable ads={filteredAds} className="ad-table" />
      )}
    </div>
  );
};

export default AdList;