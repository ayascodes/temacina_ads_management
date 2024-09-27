"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Filtre from '../filter/page';
import { useSelector } from 'react-redux';
import { generateOfferCards } from './offerSystem';
import { RootState } from '../redux/store'; // Import RootState type

interface ChooseOfferProps {
    companyType: 'ordinaire' | 'artisanal' | 'startup';
    companyMarche: 'algérien' | 'international';
    companySecteur: 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
    origineEntreprise: 'algérienne' | 'internationale';
}

function ChooseOffer({ companyType, companyMarche, companySecteur, origineEntreprise }: ChooseOfferProps) {
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [offerCards, setOfferCards] = useState<JSX.Element[]>([]);
    
    const currentAdType = useSelector((state: RootState) => state.ad.currentAdType);
    
    console.log("Current Ad Type from Redux:", currentAdType);
    const pageOptions = useMemo(() => {
        console.log('Generating page options for company type:', companyType);
        switch (companyType) {
            case 'artisanal':
                return [
                    'Page d\'accueil',
                    'Page Produit artisanal',
                    'Page Nouvel arrivage',
                    'Page Meilleurs produits',
                    'Page Soldes'
                ];
            case 'startup':
                return [
                    'Page d\'accueil',
                    'Page Startup',
                    'Page Nouvel arrivage',
                    'Page Meilleurs produits',
                    'Page Soldes'
                ];
            default:
                return [
                    'Page d\'accueil',
                    'Page secteur '+companySecteur,
                    'Page Nouvel arrivage',
                    'Page Meilleurs produits',
                    'Page Soldes'
                ];
        }
    }, [companyType]);

    useEffect(() => {
        console.log('Generating offer cards with:', { companyType, companyMarche, companySecteur, origineEntreprise, selectedPages, currentAdType });
        const allOfferCards = generateOfferCards(companyType, companyMarche, companySecteur, origineEntreprise, currentAdType);
        console.log('Generated offer cards:', allOfferCards.length);
        
        if (selectedPages.length > 0) {
            const filteredCards = allOfferCards.filter(card => {
                const cardSubtitle = (card.props as any).subtitle;
                console.log("Card subtitle:", cardSubtitle);
                return selectedPages.some(page => cardSubtitle.includes(page));
            });
            
            console.log('Filtered cards:', filteredCards.length);
            setOfferCards(filteredCards);
        } else {
            console.log('No pages selected, showing all cards');
            setOfferCards(allOfferCards);
        }
    }, [companyType, companyMarche, companySecteur, origineEntreprise, selectedPages, currentAdType]);

    const handlePageChange = (newSelection: string[]) => {
        console.log('Handle page change called with:', newSelection);
        // Directly set the new array of selected pages
        setSelectedPages(newSelection);
    };
    

    return (
        <>
            <h1 className='ChooseOfferTitle'>Nos publicités</h1>
            <Filtre
                title="Page désirée : "
                options={pageOptions}
                selected={selectedPages}
                onChange={handlePageChange}
                
            />
            <div className="offer-cards-container">
                    {offerCards.length > 0 ? offerCards : <p>No offer cards to display</p>}
            </div>

        </>
    );
}

export default ChooseOffer;