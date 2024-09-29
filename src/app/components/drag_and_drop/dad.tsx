"use client";
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setFiles } from '../features/file/fileSlice'; // Update to your path

const DragAndDrop: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Validation function
  const validateImageFile = (file: File): Promise<string | null> => {
    const MAX_FILE_SIZE = 500 * 1024; // 500 KB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Check file type
    if (!validTypes.includes(file.type)) {
      return Promise.resolve("Type de fichier invalide. Veuillez télécharger un fichier JPEG, PNG ou WebP.");
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return Promise.resolve("La taille du fichier dépasse la limite de 500KB.");
    }

    // Create an image object to check dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Validate desktop dimensions
        if (width === 1920 && (height < 500 || height > 700)) {
          return resolve("La hauteur de l'image pour le bureau doit être comprise entre 500px et 700px.");
        }

        // Validate tablet dimensions
        if (width === 1200 && (height < 400 || height > 500)) {
          return resolve("La hauteur de l'image pour la tablette doit être comprise entre 400px et 500px.");
        }

        // Validate mobile dimensions
        if (width === 800 && (height < 400 || height > 600)) {
          return resolve("La hauteur de l'image pour le mobile doit être comprise entre 400px et 600px.");
        }

        // Aspect ratio validation (for desktop)
        if (width / height !== 16 / 9 && width / height !== 16 / 5) {
          return resolve("Ratio d'aspect invalide. Pour le bureau, utilisez 16:9 ou 16:5.");
        }

        // If validation passes
        resolve(null);
      };

      img.onerror = () => {
        resolve("Échec du chargement de l'image pour la validation des dimensions.");
      };
    });
  };

  // Handle file drop event
  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    await handleFile(file);
  };

  // Handle file upload from input
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleFile(file);
  };

  // Centralized file handling
  const handleFile = async (file: File | undefined) => {
    if (file) {
      const validationError = await validateImageFile(file);
      
      if (validationError) {
        setErrorMessage(validationError); // Show error message
        return;
      } else {
        setErrorMessage(null); // Clear any previous error
        dispatch(setFiles([{ file }])); // Dispatch the file to Redux
      }
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick} // Allow click to open file dialog
        style={{
          border: '2px dashed #FF561C',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
          cursor: 'pointer' // Indicate that this is clickable
        }}
      >
        <p>Glissez-déposez un fichier image ici, ou cliquez pour télécharger</p>
        <p style={{ fontStyle: 'italic', color: '#555' }}>
            Formats acceptés : JPEG, PNG, WEBP. <br />
            Taille maximale du fichier : 500 KB. <br />
            Dimensions recommandées pour bureau : largeur 1920px x hauteur entre 500 et 700px.
            </p>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileUpload}
        style={{ display: 'none' }} // Hide the file input
        ref={fileInputRef} // Attach the ref to the file input
      />

    </div>
  );
};

export default DragAndDrop;
