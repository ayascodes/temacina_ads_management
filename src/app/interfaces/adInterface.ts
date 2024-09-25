type AdStatus = 'pending' | 'approved' | 'rejected' | 'edited'; // Add any other relevant statuses

export interface Ad {
  productId: string; // From product state
  productName: string; // Derived from product ID
  offerId: string; // From offer state
  offerTitle: string; // From offer state
  offerSubtitle: string; // From offer state
  description?: string; // Concatenated description
  startDate: string; // From current step
  duration: number; // From current step
  TotalPrice:string; //to be calculated
  Origine:string; // From company infos
  paymentMethod: string; // From current step
  status: AdStatus; // Use the union type here
}
