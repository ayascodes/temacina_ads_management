"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Filtre from '../filter/page';
import { generateOfferCards } from './offerSystem';

interface ChooseOfferProps {
    companyType: 'ordinaire' | 'artisanal' | 'startup';
    companyMarche: 'algérien' | 'international';
    companySecteur: 'Industrie' | 'Agriculture' | 'Construction' | 'ITech';
    origineEntreprise: 'algérienne' | 'internationale';
}

function ChooseOffer({ companyType, companyMarche, companySecteur, origineEntreprise }: ChooseOfferProps) {
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    
    const pageOptions = useMemo(() => {
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
                    `Page secteur ${companySecteur}`,
                    'Page Nouvel arrivage',
                    'Page Meilleurs produits',
                    'Page Soldes'
                ];
        }
    }, [companyType, companySecteur]);

    const offerCards = useMemo(() => {
        console.log('Generating offer cards with:', { companyType, companyMarche, companySecteur, origineEntreprise });
        const allOfferCards = generateOfferCards(companyType, companyMarche, companySecteur, origineEntreprise);
        console.log('Generated offer cards:', allOfferCards.length);

        if (selectedPages.length > 0) {
            const filteredCards = allOfferCards.filter(card => {
                const cardSubtitle = (card.props as any).subtitle;
                return selectedPages.some(page => cardSubtitle === page);
            });

            console.log('Filtered cards:', filteredCards.length);
            return filteredCards;
        }

        return allOfferCards;
    }, [companyType, companyMarche, companySecteur, origineEntreprise, selectedPages]);

    const handlePageChange = (newSelection: string[]) => {
        console.log('Handle page change called with:', newSelection);
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
