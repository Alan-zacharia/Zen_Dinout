class OTPGenerator {
  generateOtp(): number {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  }
}

export const otpGenerator = new OTPGenerator();
