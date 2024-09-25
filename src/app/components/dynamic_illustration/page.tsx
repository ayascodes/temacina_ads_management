"use client";
import React, { useEffect, useState } from 'react';

const StaticColoredIllustration = ({ svgPath, placements }) => {
  const [coloredSvg, setColoredSvg] = useState('');

  useEffect(() => {
    const fetchAndColorSvg = async () => {
      try {
        // Fetch the SVG
        const response = await fetch(svgPath);
        const svgText = await response.text();
        /* console.log('Fetched SVG:', svgText); // Debugging */

        // Parse the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Color the placements
        placements.forEach(placement => {
          const element = svgDoc.getElementById(placement.id);
          
          if (element) {
            // Check if the target is a group (<g> tag), and if so, color its children
            if (element.tagName === 'g') {
              const children = element.querySelectorAll('*');
              children.forEach(child => {
                child.setAttribute('fill', placement.color);
              });
            } else {
              // Otherwise, color the element directly
              element.setAttribute('fill', placement.color);
            }
          }
        });

        // Serialize the modified SVG back to a string
        const serializer = new XMLSerializer();
        const coloredSvgString = serializer.serializeToString(svgDoc);

        setColoredSvg(coloredSvgString);
      } catch (error) {
        console.error('Error processing SVG:', error);
      }
    };

    fetchAndColorSvg();
  }, [svgPath, placements]);

  return (
    <div className="w-full h-full">
      {coloredSvg ? (
        <div dangerouslySetInnerHTML={{ __html: coloredSvg }} className='illustration'/>
      ) : (
        'SVG not available'
      )}
    </div>
  );
};

export default StaticColoredIllustration;
