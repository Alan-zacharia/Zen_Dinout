export interface userType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  _id?: string;
}

export interface otpType {
  otp: string;
}

/** return api response */
export interface credentials {
  username: string;
  email: string;
  password: string;
}

/** User type */
export interface userTypesCredentials {
  username: string;
  email: string;
  password: string;
  contact?: string;
  _id?: string;
}

/** return api response */
export interface APIresponse {
  data: {
    message?: string;
    user?: credentials;
    token?: string;
    refreshToken?: string;
    otp?: string;
  };
}
/** Wallet */
export interface WalletType {
  _id: string;
  userId: {
    username: string;
    email: string;
  };
  balance: number;
  transactions: {
    amount: number;
    date: string;
    type: string;
    description: string;
  }[];
}
/** Coupons */
export interface CouponType {
  _id: string;
  couponCode: string;
  description: string;
  minPurchase: number;
  discount: number;
  discountPrice: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}
/** Saved Restaurants */
export interface savedRestaurantsType {
  _id: string;
  restaurantId: {
    _id : string;
    restaurantName : string;
    email: string;
    featuredImage: {
      url : string;
      public_id : string;
    };
    address : string;
    openingTime : string;
    closingTime : string
  };
  userId: {
    username: string;
  };
}
