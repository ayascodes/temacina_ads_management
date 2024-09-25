// AdList.js
"use client";
import React, { useState, useEffect } from 'react';
import AdTable from '../AdTable/AdTable';
import Filtre from '../filter/page'; // Import the Filtre component

const AdList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = ['Approved', 'Pending', 'Rejected', 'Expired'];
  const typeOptions = ['Mega Haut Slide', 'Nom de Produit'];

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/data/ads.json');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setAds(data.ads);
        setLoading(false);
      } catch (err) {
        setError('Failed to load ads. Please try again later.');
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const filteredAds = ads.filter((ad) => {
    const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(ad.status);
    const typeMatch = selectedType.length === 0 || selectedType.includes(ad.type_de_publicite.split(':')[0].trim());
    return statusMatch && typeMatch;
  });

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="ad-list p-4">
      <Filtre
        title="Status Filter"
        options={statusOptions}
        selected={selectedStatus}
        onChange={setSelectedStatus}
      />
      <Filtre
        title="Type Filter"
        options={typeOptions}
        selected={selectedType}
        onChange={setSelectedType}
      />

      <div className="filtered-ads mt-6">
        {filteredAds.length > 0 ? (
          <AdTable ads={filteredAds} className="ad-table" />
        ) : (
          <p className="no-ads-message text-gray-500">No ads match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default AdList;
