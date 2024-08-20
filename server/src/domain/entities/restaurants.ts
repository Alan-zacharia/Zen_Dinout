export class RestaurantType {
  constructor(
    public readonly restaurantName: string,
    public readonly email: string,
    public readonly contact: string,
    public readonly address: string,
    public readonly password: string,
    public readonly description: string,
    public readonly openingTime: string,
    public readonly location: {
      type: string;
      coordinates: [string, string];
    },
    public readonly closingTime: string,
    public readonly TableRate: string,
    public readonly featuredImage: string,
    public readonly secondaryImages: string,
    public readonly place_name: string,
  ) {}
}

export interface tableSlotTypes {
  restaurantId?: string;
  tableNumber: string;
  tableCapacity: number;
  tableLocation: "In" | "Out";
}


