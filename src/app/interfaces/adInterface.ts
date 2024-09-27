type AdStatus = 'pending' | 'approved' | 'rejected' | 'edited'; // Add any other relevant statuses

export interface Ad {
  productId: string; // From product state
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
  status: AdStatus; // Use the union type here
}
