export interface RestaurantType {
  email: string;
  contact: string;
  restaurantName: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  description: string;
  closingTime: string;
  openingTime: string;
  TableRate: string;
  secondaryImages: string;
  featuredImage: string;
  _id?: string;
  place_name?: string;
}

export interface tableSlotTypes {
  tableImage: {
    url: string;
    public_id: string;
  };
  tableNumber: string;
  tableCapacity: number;
  tableLocation: string;
  _id?: string;
  tableId: string;
  isAvailable?: boolean;
}

export interface tableTimeSlots {
  _id: string;
  tableId: string;
  slotStartTime: string;
  slotEndTime: string;
  slotDate: string;
  IsAvailable: boolean;
}


export interface BookingDetailsType {
  bookingId: string;
  email: string;
  tableNo: string;
  tableSize: number;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: string;
  totalAmount: number;
  paymentMethod: string;
}
export interface BookingsHistory {
  _id: string;
  bookingId: string;
  userId: {
    username: string;
    email: string;
  };
  tableSlotId: string;
  restaurantId: {
    _id: string;
    restaurantName: string;
    featuredImage: {
      url: string;
      public_id: string;
    };
    tableRate : string;
  };
  bookingTime: number;
  bookingDate: string;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
  paymentMethod: string;
  guestCount: number;
  subTotal: number;
  table?: {
    tableNumber : string
  };
  createdAt: string;
}

export interface RestaurantDetailType {
  _id: string;
  restaurantName: string;
  email: string;
  contact?: string;
  password?: string;
  address?: string;
  description?: string;
  tableRate: number;
  place_name?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  openingTime?: string;
  closingTime?: string;
  isListed?: boolean;
  featuredImage?: {
    url: string;
    public_id: string;
  };
  secondaryImages?: [
    {
      url: string;
      public_id: string;
      _id: string;
    }
  ];
  isApproved?: boolean;
  isRejected?: boolean;
  cuisines?: string[];
  vegOrNonVegType?: "veg" | "non-veg" | "both";
  createdAt?: Date;
}

export interface RestaurantImageType {
  url: string;
  public_id: string;
  _id: string;
}

export interface TimeSlotType {
  _id: string;
  time: string;
  date: string;
  availableTables: string;
  maxTables: string;
}
export interface MenuType {
  _id: string;
  restaurantId: string;
  items: {
    public_id: string;
    url: string;
  }[];
}