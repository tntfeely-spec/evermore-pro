export interface FuneralHomeAccount {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  plan: string | null;
  referral_source: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'trialing' | 'active' | 'cancelled' | 'inactive';
  created_at: string;
  user_id: string;
}

export interface FuneralHomeListing {
  id: string;
  account_id: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  services: string[];
  price_range_cremation: string | null;
  price_range_burial: string | null;
  photos: string[];
  verified: boolean;
  updated_at: string;
}

export interface FamilyInquiry {
  id: string;
  account_id: string;
  family_name: string;
  email: string;
  phone: string | null;
  service_type: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
}
