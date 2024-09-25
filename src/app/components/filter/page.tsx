// Filtre.js
import React from 'react';

const Filtre = ({ title, options, selected, onChange }) => {
  const handleFilterChange = (setter) => (event) => {
    const { value, checked } = event.target;
    setter((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };
  return (
    <div className="filter-section">
      <h3 className="filter-title">{title}</h3>
      <div className="filter-options">
        {options.map((option) => (
          <label key={option} className="filter-label">
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={handleFilterChange(onChange)}
              className="filter-checkbox"
            />
            <span className="filter-option-text">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filtre;
