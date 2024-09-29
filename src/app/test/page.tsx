// ParentComponent.tsx
import React from 'react';
import DragAndDropUpload from '../components/drag_and_drop/dad';
import PreviewComponent from '../components/drag_and_drop/PreviewComponent';

const ParentComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>File Upload Example with TypeScript and Redux</h2>
      {/* Drag and Drop Upload */}
      <DragAndDropUpload />

      {/* Button to visualize the uploaded image */}
      <PreviewComponent />
    </div>
  );
};

export default ParentComponent;
