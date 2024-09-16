"use client";
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';    
import AdsClickIcon from '@mui/icons-material/AdsClick';
import Link from 'next/link';
import StatusButton from '../status/status';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function AdsCreation() {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null); // Track selected product ID
    const theme = createTheme({
      components: {
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: 'gray',
              '&.Mui-checked': {
                color: '#FF561C', // Orange color for checked state
              },
            },
          },
        },
      },
    });
    useEffect(() => {
      async function fetchProductData() {
        try {
          const response = await fetch('/data/products.json');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
  
      fetchProductData();
    }, []);
  
    // Handle checkbox change
    const handleCheckboxChange = (productId) => {
      if (selectedProductId === productId) {
        setSelectedProductId(null); // Unselect the product
      } else {
        setSelectedProductId(productId); // Select a new product
      }
    };
  
    return (
      <ThemeProvider theme={theme}>
        <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} className='table'>
          <TableHead>
            <TableRow>
              <TableCell className='TableHead'>Select</TableCell>
              <TableCell className='TableHead'>Produits</TableCell>
              <TableCell className='TableHead' align="left">Secteur</TableCell>
              <TableCell className='TableHead' align="left">Categorie</TableCell>
              <TableCell className='TableHead' align="left">Sous categorie</TableCell>
              <TableCell className='TableHead' align="left">Prix</TableCell>
              <TableCell className='TableHead' align="left">Status</TableCell>
              <TableCell className='TableHead' align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className={`
                  tableRow 
                  ${selectedProductId !== null && selectedProductId !== product.id ? 'tableRowDisabled' : ''} 
                  ${selectedProductId === product.id ? 'tableRowSelected' : ''}
                `}
              >
                <TableCell>

                  <Checkbox
                    checked={selectedProductId === product.id} // Only check the selected product
                    onChange={() => handleCheckboxChange(product.id)} // Handle selection logic
                    // Disable other checkboxes if one is selected
                    disabled={selectedProductId !== null && selectedProductId !== product.id}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell align="left">{product.secteur}</TableCell>
                <TableCell align="left">{product.categorie}</TableCell>
                <TableCell align="left">{product.sousCategorie}</TableCell>
                <TableCell align="left">{product.prix}</TableCell>
                <TableCell align="left"><StatusButton status={product.status} /></TableCell>
                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)',  // Two columns
                      gridTemplateRows: 'repeat(2, auto)',    // Two rows
                      gap: '10px',                             // Adjust gap for spacing
                      justifyItems: 'center',                 // Center the icons horizontally
                      alignItems: 'center',                   // Center the icons vertically
                  }}>
                    <Link href="/edit">
                      <EditIcon style={{ color: 'black' }} />
                    </Link>
                    <Link href="/archive">
                      <ArchiveIcon style={{ color: 'black' }} />
                    </Link>
                    <Link href="/delete">
                      <DeleteIcon style={{ color: 'black' }} />
                    </Link>
                    <Link href="/create-ad">
                      <AdsClickIcon style={{ color: 'black' }} />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Container className='AdsCreationContainer'>
        <div className='AdsCreationButton'>
            <h3>Créer une publicite <span className="highlight">Mega Slide Haut</span></h3>
        </div>
        <div className='AdsCreationButton'>
            <h3>Procéder avec <span className="highlight">le Produit selectionné</span> </h3>
        </div>
      </Container>
      </>
      </ThemeProvider>
    );
  }
  
  export default AdsCreation;
