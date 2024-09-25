/* PRE STEPPER POSITION */
"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../components/redux/hooks';
import { Container, Typography, Paper, Grid } from '@mui/material';
import Link from 'next/link';


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
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Name:</Typography>
            <Typography variant="body1">{product.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Sector:</Typography>
            <Typography variant="body1">{product.secteur}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Category:</Typography>
            <Typography variant="body1">{product.categorie}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Subcategory:</Typography>
            <Typography variant="body1">{product.sousCategorie}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Price:</Typography>
            <Typography variant="body1">{product.prix}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Status:</Typography>
            <Typography variant="body1">{product.status}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <button>
      <Link href="/stepper" passHref>
      Commencer
      </Link>
      </button>
      
    </Container>
  );
}

export default ProductDetailPage;
