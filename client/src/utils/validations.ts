import * as Yup from "yup";
import { otpType } from "../types/userTypes";
import { CouponDetailsType } from "../types/admin";

export const loginValidation = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Password must be strong and include one special character.!"
      ),
  });
};

export const registerValidation = () => {
  return Yup.object().shape({
    username: Yup.string()
      .trim()
      .required("Please enter your full name!")
      .matches(/^[A-Za-z]/, "First letter should be a capital letter.")
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),

    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Password must be strong and contain at least one special character.!"
      ),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });
};

export const validateOtp = (value: otpType) => {
  const error: Partial<otpType> = {};
  if (!value.otp) {
    error.otp = "Otp is required";
  } else if (value.otp.length < 6) {
    error.otp = "Otp must be 6 characters long";
  }
  return error;
};

export const validateTableSlot = () => {
  return Yup.object().shape({
    tableNumber: Yup.string()
      .required("Table number is required.")
      .matches(
        /^[A-Z](?=.*\d).+$/,
        "Table name must start with a letter and one number."
      ),
    tableLocation: Yup.string().required("Please select table location."),
  });
};
export const validateTableSlotTimes = () => {
  return Yup.object().shape({
    tableSlotDate: Yup.string().required("Date is required."),
    tableSlotTime: Yup.string().required("Time is required."),
  });
};

export const valdateResetPassword = () => {
  return Yup.object().shape({
    password: Yup.string()
      .required("Please enter your password !")
      .max(20, "Please enter a password less than 20 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required !")
      .min(8, "Password must be 8 characters long !")
      .max(20, "Please enter a password less than 20 characters")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
};

export const validateAdminLogin = () => {
  return Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email. !")
      .email("Invalid Email address..."),
    password: Yup.string()
      .required("Please enter your password. !")
      .min(8, "Password must be 8 characters long.")
      .max(20, "Password must be less than 20 char"),
  });
};
const stripTimeFromDate = (date: Date) => {
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

export const validateCouponDetails = () => {
  return Yup.object().shape({
    couponCode: Yup.string()
      .required("Coupon code is required.!")
      .min(2, "Code must be min 2 chars long.!"),
    description: Yup.string()
      .required("Description is required.!")
      .trim()
      .min(5, "Minimum 5 chars.!"),
    minPurchase: Yup.number()
      .required("Minimum purchase amount required.!")
      .min(100, "Minimum purchase must be standard rate.!")
      .max(1000, "Minimum purchase limit is 1000.!"),
    discount: Yup.number()
      .required("Discount is required.!")
      .min(1, "Enter a valid percentage")
      .max(100, "Please enter valid percentage"),
    discountPrice: Yup.number()
      .required("Discount price is required.!")
      .min(50, "Enter a value greater than 50")
      .max(1000, "Please enter less than 1000"),
    startDate: Yup.date()
      .required("Start date is required.!")
      .transform((value) => stripTimeFromDate(value))
      .min(stripTimeFromDate(new Date()), "Please enter a valid date.!"),
    expiryDate: Yup.date()
      .required("End date is required.!")
      .transform((value) => stripTimeFromDate(value))
      .min(Yup.ref("startDate"), "End date must be after start date."),
  });
};

export const validateMemberShipDetails = () => {
  const validTypes = ["Monthly", "Annual"];
  return Yup.object().shape({
    planName: Yup.string().required("Plan name is required.!"),
    description: Yup.string()
      .required("Description is required.!")
      .trim()
      .min(5, "Minimum 5 characters long.!"),
    type: Yup.string()
      .required("Type is required.!")
      .oneOf(validTypes, "Invalid Type value!."),
    cost: Yup.number()
      .required("Purchase amount is required.!")
      .min(99, "Please enter greater than 99.")
      .max(1000, "Please enter less than 1000"),
    expiryDate: Yup.date()
      .required("Expiry date is required.!")
      .transform((value) => stripTimeFromDate(value))
      .min(stripTimeFromDate(new Date()), "Please enter a valid date.!"),
    benefits: Yup.array()
      .of(Yup.string().required("Benefit cannot be empty."))
      .min(1, "At least one benefit is required.")
      .required("Benefits are required."),
  });
};

export const validationSchema = () => {
  return Yup.object().shape({
    startTime: Yup.string()
      .required("Start time is required")
      .matches(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Start time must be in HH:mm format"
      ),
    endTime: Yup.string()
      .required("End time is required")
      .matches(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "End time must be in HH:mm format"
      )
      .test(
        "is-greater",
        "End time must be greater than start time",
        function (value) {
          const { startTime } = this.parent;
          return startTime && value && value > startTime;
        }
      ),
  });
};

export const validateForm = (
  formData: CouponDetailsType,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  const newErrors: { [key: string]: string } = {};
  if (!formData.couponCode) {
    newErrors.couponCode = "Coupon code is required.";
  }
  if (!formData.description) {
    newErrors.description = "Description is required.";
  }
  if (!formData.minPurchase || isNaN(Number(formData.minPurchase))) {
    newErrors.minPurchase = "Minimum purchase must be a number.";
  } else if (Number(formData.minPurchase) <= 0) {
    newErrors.minPurchase = "Minimum purchase must be greater than zero.";
  }
  if (!formData.discount || isNaN(Number(formData.discount))) {
    newErrors.discount = "Discount must be a number.";
  } else if (Number(formData.discount) <= 0 || Number(formData.discount) > 99) {
    newErrors.discount = "Enter a valid discount percentage between 1 and 99.";
  }
  if (!formData.discountPrice || isNaN(Number(formData.discountPrice))) {
    newErrors.discountPrice = "Discount amount must be a number.";
  } else if (Number(formData.discountPrice) < 0) {
    newErrors.discountPrice = "Discount amount cannot be negative.";
  }
  if (formData.startDate && formData.expiryDate) {
    const startDate = new Date(formData.startDate);
    const expiryDate = new Date(formData.expiryDate);

    if (startDate >= expiryDate) {
      newErrors.dateRange = "Start date must be before end date.";
    }
    if (expiryDate <= new Date()) {
      newErrors.expiryDate = "End date must be in the future.";
    }
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
