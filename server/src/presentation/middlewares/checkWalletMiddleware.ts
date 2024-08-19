import {  Request , Response ,  NextFunction } from "express";
import Wallet from "../../infrastructure/database/model.ts/wallet";

export const checkWallet = async (req : Request , res : Response, next : NextFunction) => {
   console.log("wallet")
    const wallet = await Wallet.findOne({ userId: req.userId });
    if (!wallet) {
      const newWallet = new Wallet({ userId: req.userId });
      await newWallet.save();
    }
    next();
  };