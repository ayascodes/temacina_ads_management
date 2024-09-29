// PreviewComponent.tsx
"use client";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PreviewComponent: React.FC = () => {
  const currentAd = useSelector((state: RootState) => state.ad.currentAd);
  const [previewUrl, setPreviewUrlState] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleVisualize = () => {
    if (currentAd?.file) {
      const newPreviewUrl = URL.createObjectURL(currentAd.file);
      setPreviewUrlState(newPreviewUrl);
      setModalOpen(true);
    } else {
      alert('No file uploaded to visualize.');
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    // Additional confirm logic can be added here if needed
  };

  return (
    <div>
      <button
        onClick={handleVisualize}
        style={{
          backgroundColor: '#FF561C',
          color: '#FFF',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Visualiser
      </button>

      {isModalOpen && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h3>Aperçu de l'image :</h3>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
              />
            )}
            <button
              onClick={handleConfirm}
              style={{
                backgroundColor: '#FF561C',
                color: '#FFF',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal styles
const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
};

export default PreviewComponent;