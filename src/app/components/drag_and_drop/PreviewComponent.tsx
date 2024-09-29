// PreviewComponent.tsx
"use client";
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreviewUrl } from '../features/file/fileSlice';
import { RootState } from '../redux/store'; // Import RootState type for Redux

const PreviewComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { files } = useSelector((state: RootState) => state.file);
  const [previewUrl, setPreviewUrlState] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleVisualize = () => {
    if (files.length > 0) {
      const file = files[0].file;
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrlState(newPreviewUrl); // Set the preview URL in local state
      setModalOpen(true); // Open the modal
      dispatch(setPreviewUrl(newPreviewUrl)); // Optionally set preview URL in Redux
    } else {
      alert('No file uploaded to visualize.');
    }
  };

  const handleConfirm = () => {
    setModalOpen(false); // Close the modal
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
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // Make sure the modal is on top
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
