export interface RestaurantType {
  _id: string;
  restaurantName: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  description: string;
  openingTime: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  closingTime: string;
  tableRate: string;
  featuredImage: {
    url: string;
    public_id: string;
  };
  secondaryImages: [
    {
      url: string;
      public_id: string;
    }
  ];
  cuisines: [string];
  vegOrNonVegType: string;
  place_name: string;
  isListed: boolean;
  isApproved: boolean;
  isRejected: boolean;
}

export interface TableDataType {
  restaurantId?: string;
  tableImage: {
    url: string;
    public_id: string;
  };
  tableNumber: string;
  tableCapacity: number;
  tableLocation: "In" | "Out";
  isAvailable: boolean;
}
export interface TimeSlotType {
  restaurantId: string;
  time: string;
  date: string;
  isAvailable: boolean;
  isBooked: boolean;
  maxTables: number;
}

export interface MenuType {
  _id: string;
  restaurantId: string;
  items: [
    {
      public_id: string;
      url: string;
    }
  ];
}
