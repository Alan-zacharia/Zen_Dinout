export class CouponDetailsInterface {
  constructor(
    public readonly couponCode: string,
    public readonly description: string,
    public readonly minPurchase: number,
    public readonly discount: number,
    public readonly discountPrice: number,
    public readonly startDate: Date ,
    public readonly expiryDate: Date,
    public readonly isActive: boolean,
  ) {}
}
export class memberShipType {
  constructor(
    public readonly planName: string,
    public readonly description: string,
    public readonly type: string,
    public readonly cost: number,
    public readonly benefits?: [string] ,
    public readonly users?: string,
    public readonly _id?: string,
    public readonly discount?: number,
  ) {}
}


