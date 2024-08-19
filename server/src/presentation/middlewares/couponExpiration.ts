import { NextFunction, Request, Response } from "express";
import couponModel from "../../infrastructure/database/model.ts/couponModel";

export const checkCouponExpiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expiredCoupons = await couponModel.find({
      expiryDate: { $lte: new Date() },
      isActive: true,
    });

    for (const coupon of expiredCoupons) {
      coupon.isActive = false;
      await coupon.save();
    }
    console.log(`Updated ${expiredCoupons.length} coupons to expired.`);
    next();
  } catch (error) {
    console.error("Error updating coupons:", (error as Error).message);
    res.status(500).send("Internal server error");
  }
};
