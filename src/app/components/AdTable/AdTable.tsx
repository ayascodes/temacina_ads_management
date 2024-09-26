"use client";
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';    
import Link from 'next/link';
import StatusButton from '../status/status';
import PaymentIcon from '@mui/icons-material/Payment';

const AdTable = ({ ads = [] }) => {
  if (!Array.isArray(ads) || ads.length === 0) {
    return <div>No ads available</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} className='table'>
        <TableHead>
          <TableRow>
            <TableCell className='TableHead'>Type</TableCell>
            <TableCell className='TableHead' align="left">Description</TableCell>
            <TableCell className='TableHead' align="left">Commence le</TableCell>
            <TableCell className='TableHead' align="left">Duré</TableCell>
            <TableCell className='TableHead' align="left">Origine de l'entreprise</TableCell>
            <TableCell className='TableHead' align="left">Montant totale</TableCell>
            <TableCell className='TableHead' align="left">Status</TableCell>
            <TableCell className='TableHead' align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ads.map((ad) => (
            <Link href={`/ad-details/${ad.id}`} key={ad.id} passHref legacyBehavior>
              <TableRow
                component="a"
                style={{ cursor: 'pointer', textDecoration: 'none'}}
                hover
              >
                <TableCell component="th" scope="row">
                  {ad.type_de_publicite}
                </TableCell>
                <TableCell style={{ padding: '40px' }} align="left">{ad.description}</TableCell>
                <TableCell style={{ padding: '40px' }} align="left">{ad.commence_le}</TableCell>
                <TableCell style={{ padding: '40px' }} align="left">{ad.duree} {ad.durationUnit}</TableCell>
                <TableCell style={{ padding: '40px' }} align="left">{ad.origine_de_lentreprise}</TableCell>
                <TableCell style={{ padding: '40px' }} align="left">{ad.montant_totale}</TableCell>
                <TableCell style={{ padding: '40px' }} align="left"><StatusButton status={ad.status} /></TableCell>
                <TableCell style={{ padding: '40px' }} align="center">
                  <div style={{ 
                      display: 'flex',  
                      justifyItems: 'center',
                      alignItems: 'center',
                  }}>
                    <Link href={`/edit/${ad.id}`} onClick={(e) => e.stopPropagation()}>
                      <EditIcon style={{ color: 'black' }} />
                    </Link>
                    <Link href={`/delete/${ad.id}`} onClick={(e) => e.stopPropagation()}>
                      <DeleteIcon style={{ color: 'black' }} />
                    </Link>
                    <Link 
                      href={ad.status === 'Approved' ? `/PaymentIcon/${ad.id}` : '#'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ad.status !== 'Approved') {
                          e.preventDefault();
                        }
                      }}
                      style={{
                        pointerEvents: ad.status === 'Approved' ? 'auto' : 'none',
                        opacity: ad.status === 'Approved' ? 1 : 0.5,
                      }}
                    >
                      <PaymentIcon style={{ color: ad.status === 'Approved' ? 'black' : 'grey' }} />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdTable;