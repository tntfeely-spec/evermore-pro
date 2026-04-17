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
  business_description: string | null;
  phone: string | null;
  website: string | null;
  services_offered: string[];
  price_range_cremation: string | null;
  price_range_burial: string | null;
  photos: string[];
  is_verified: boolean;
  created_at: string;
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
  status: 'new' | 'read';
  created_at: string;
}
