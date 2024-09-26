/* PRE STEPPER POSITION */
"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../components/redux/hooks';
import { Container, Typography, Paper, Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';


interface Product {
  id: string;
  name: string;
  secteur: string;
  categorie: string;
  sousCategorie: string;
  prix: string;
  status: string;
  // Add any other properties your product has
}

function ProductDetailPage() {
    const selectedProductId = useAppSelector(state => state.product.selectedProductId);
    const [product, setProduct] = useState<Product | null>(null);
  
    useEffect(() => {
      async function fetchProductData() {
        if (!selectedProductId) {
          console.error('No product selected');
          return;
        }
    
        try {
          // Fetch the entire products JSON file
          const response = await fetch('/data/products.json'); // Make sure the path is correct
          if (!response.ok) {
            throw new Error('Failed to fetch product data');
          }
    
          const products = await response.json();
    
          // Find the specific product based on selectedProductId
          const product = products.find(p => p.id === selectedProductId);
          if (!product) {
            console.error('Product not found');
            return;
          }
          setProduct(product);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    
      fetchProductData();
    }, [selectedProductId]); 
    console.log('hiiiiiiiiiiiiiiiiiiiii',selectedProductId);

  if (!selectedProductId) {
    return <Typography variant="h6">No product selected. Please go back and select a product.</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Loading product data...</Typography>;
  }

  return (
    <>
    <div className="marketin_visual_title">
      <h1>Marketing Visuel  DA TTC/Jour</h1>
    </div>
    <Container className="productInfoContainer" maxWidth="xl">
      <Paper className="paper" elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <h1>
          Publicité Du Produit <span className='highlight'>{product.name}</span>
        </h1>
        <div className='part'>
            <div className="partone">
              <Image src="/logooo.png" alt="Company logo" width={400} height={600} />
            </div>

            <div className="parttwo">
                <div className="cardLine">
                  <h3>Nom du produit :</h3>
                  <p>{product.name}</p>
                </div>
                <div>
                  <h3>Description :</h3>
                  <p>{product.description}</p>
                </div>
                <div className="cardLine">
                  <h3>Secteur :</h3>
                  <p>{product.secteur}</p>
                </div>
                <div className="cardLine">
                  <h3>Categorie :</h3>
                  <p>{product.categorie}</p>
                </div>
                <div className="cardLine">
                  <h3>Sous categorie :</h3>
                  <p>{product.sousCategorie}</p>
                </div>
                <div className="cardLine">
                  <h3>Marché visé   :</h3>
                  <p>{product.marcheVise}</p>
                </div>
                <div className="cardLine">
                  <h3>Prix   :</h3>
                  <p>{product.prix}</p>
                </div>
                <div className="cardLine">
                  <h3>Quantité   :</h3>
                  <p>{product.quantite}</p>
                </div>
              </div>
          </div>
      </Paper>
    </Container>
    <div className="btnContainer">
        <button className="backBtn">
          <Link href="/" passHref>
            <a>Retour</a> {/* Explicit <a> tag */}
          </Link>
        </button>
    
        <button className="nextBtn">
          <Link href="/stepper" passHref>
            <a>Commencer</a> {/* Explicit <a> tag */}
          </Link>
        </button>
  </div>
  </>
);
}

export default ProductDetailPage;
