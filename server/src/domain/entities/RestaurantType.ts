export interface RestaurantType {
    restaurantName: string;
    email: string;
    contact: string;
    address: string;
    description: string;
    openingTime: string;
    location: {
      type: string;
      coordinates: [string, string];
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
    place_name: string;
    isListed: boolean;
    isApproved: boolean;
    isRejected: boolean;
    _id: string;
  }
  