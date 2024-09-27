export type AdStatus = 'pending' | 'approved' | 'rejected' | 'edited'; // Add any other relevant statuses
export type AdType = 'product' | 'megaSlideHaut';
export interface Ad {
  id: string;
  type: AdType;
  status: AdStatus;
  productId?: string; // From product state
  type_de_publicite: string; // Derived from product ID
  offerId: string; // From offer state
  offerTitle: string; // From offer state
  offerSubtitle: string; // From offer state
  description?: string; // Concatenated description
  commence_le: string; // From current step
  duree: number;
  durationUnit:string // From current step
  montant_totale:string; //to be calculated
  origine_de_lentreprise:string; // From company infos
  paymentMethod: string; // From current step
  title?: string;
  imageUrl?: string;
}
