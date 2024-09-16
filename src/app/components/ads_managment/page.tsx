"use client";
import React, { useState, useEffect } from 'react';
import AdTable from '../AdTable/AdTable';

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
        // In the real scenario, this would be replaced with an API call
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

  const handleFilterChange = (setter) => (event) => {
    const { value, checked } = event.target;
    setter((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const filteredAds = ads.filter((ad) => {
    const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(ad.status);
    const typeMatch = selectedType.length === 0 || selectedType.includes(ad.type_de_publicite.split(':')[0].trim());
    return statusMatch && typeMatch;
  });

  const FilterSection = ({ title, options, selected, onChange }) => (
    <div className="filter-section">
      <h3 className="filter-title">{title}</h3>
      <div className="filter-options ">
        {options.map((option) => (
          <label key={option} className="filter-label">
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={onChange}
              className="filter-checkbox"
            />
            <span className="filter-option-text ">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="ad-list p-4">
      <FilterSection
        title="Status Filter"
        options={statusOptions}
        selected={selectedStatus}
        onChange={handleFilterChange(setSelectedStatus)}
      />
      <FilterSection
        title="Type Filter"
        options={typeOptions}
        selected={selectedType}
        onChange={handleFilterChange(setSelectedType)}
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
