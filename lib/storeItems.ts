export interface StoreItem {
  id: string;
  sku: string;
  title: string;
  description: string;
}

// Static mapping between RevenueCat product identifiers (SKU) and store items.
export const STORE_ITEMS: Record<string, StoreItem> = {
  basic_pack: {
    id: 'basic_pack',
    sku: 'basic_pack',
    title: 'Basic Pack',
    description: 'Starter pack of items'
  },
  premium_pack: {
    id: 'premium_pack',
    sku: 'premium_pack',
    title: 'Premium Pack',
    description: 'Premium pack of items'
  }
};
