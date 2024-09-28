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
import StatusButton from '../status/status';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';    
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Link from 'next/link';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { selectProduct } from '../features/product/productSlice';
import { useDispatch } from 'react-redux';
import { setCurrentAdType } from '../features/ad/adSlice';

function AdsCreation() {
  const dispatche = useAppDispatch();
  const selectedProductId = useAppSelector(state => state.product.selectedProductId);
  const [products, setProducts] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const dispatch = useDispatch();
  const theme = createTheme({
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: 'gray',
            '&.Mui-checked': {
              color: '#FF561C',
            },
          },
        },
      },
    },
  });
  const [priceUnit, setPriceUnit] = useState('');

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch('/data/companyData.json');
        const data = await response.json();
        setCompanyData(data);

        // Get selectedMarket from the fetched company data
        const selectedMarket = data.company.selectedMarket;

        // Set price unit based on selected market
        if (selectedMarket === 'algérien') {
          setPriceUnit('DZD');
        } else {
          setPriceUnit('USD');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }

    fetchCompanyData();
  }, []);

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

  const handleCheckboxChange = (productId, status) => {
    if (status !== 'Rejected') {
      if (selectedProductId === productId) {
        dispatch(selectProduct(null));
      } else {
        dispatch(selectProduct(productId));
      }
    }
  };

  const handleProductAdClick = (productId, status) => {
    if (status !== 'Rejected') {
      dispatch(selectProduct(productId));
    }
  };
  const handleAdCreation = (adType: AdType) => {
    dispatch(setCurrentAdType(adType));
    console.log(adType);
  };

  const isProductRejected = (productId) => {
    const product = products.find(p => p.id === productId);
    return product && product.status === 'Rejected';
  };

  const renderActionIcons = (product) => {
    const isRejected = product.status === 'Rejected';
    const iconStyle = { color: isRejected ? 'gray' : 'black', cursor: isRejected ? 'not-allowed' : 'pointer' };
    const linkStyle = { pointerEvents: isRejected ? 'none' : 'auto' };


  
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, auto)',
        gap: '10px',
        justifyItems: 'center',
        alignItems: 'center',
      }}>
        <Link href={isRejected ? '#' : "/edit"} style={linkStyle}>
          <EditIcon style={iconStyle} />
        </Link>
        <Link href={isRejected ? '#' : "/archive"} style={linkStyle}>
          <ArchiveIcon style={iconStyle} />
        </Link>
        <Link href={isRejected ? '#' : "/delete"} style={linkStyle}>
          <DeleteIcon style={iconStyle} />
        </Link>
        <Link 
          href={isRejected ? '#' : `/product_info`}
          onClick={() => !isRejected && handleProductAdClick(product.id)}
          style={linkStyle}
        >
          <AdsClickIcon style={iconStyle} />
        </Link>
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} className="table">
          <TableHead>
            <TableRow>
              <TableCell className="TableHead">Select</TableCell>
              <TableCell className="TableHead">Produits</TableCell>
              <TableCell className="TableHead" align="left">Secteur</TableCell>
              <TableCell className="TableHead" align="left">Categorie</TableCell>
              <TableCell className="TableHead" align="left">Sous categorie</TableCell>
              <TableCell className="TableHead" align="left">Prix</TableCell>
              <TableCell className="TableHead" align="left">Status</TableCell>
              <TableCell className="TableHead" align="left">Actions</TableCell>
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
                  ${product.status === 'Rejected' ? 'tableRowRejected' : ''}
                `}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProductId === product.id}
                    onChange={() => handleCheckboxChange(product.id, product.status)}
                    disabled={selectedProductId !== null && selectedProductId !== product.id || product.status === 'rejected'}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.secteur}</TableCell>
                <TableCell>{product.categorie}</TableCell>
                <TableCell>{product.sousCategorie}</TableCell>
                <TableCell>{product.prix} {priceUnit}</TableCell>
                <TableCell align="left"><StatusButton status={product.status} /></TableCell>
                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  {renderActionIcons(product)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Container className='AdsCreationContainer'>
        <Link
        href={'/stepper'}
        onClick={() => handleAdCreation('megaHautSlide')}
        >
          <div className='AdsCreationButton' >
            <h3>Créer une publicite <span className="highlight">Mega Slide Haut</span></h3>
          </div>
        </Link>
        <Link 
          href={!isProductRejected(selectedProductId) ? `/product_info` : '#'}
          onClick={() => {
            if (!isProductRejected(selectedProductId)) {
              handleProductAdClick(selectedProductId);
              handleAdCreation('product');
            }
          }}          
          style={{ pointerEvents: isProductRejected(selectedProductId) ? 'none' : 'auto' }}
        >
          <div className='AdsCreationButton' style={{ opacity: isProductRejected(selectedProductId) ? 0.5 : 1 }}>
            <h3>Procéder avec <span className="highlight">le Produit selectionné</span></h3>
          </div>
        </Link>
      </Container>
    </ThemeProvider>
  );
}

export default AdsCreation;