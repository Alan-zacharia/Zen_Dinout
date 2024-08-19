import * as Yup from "yup";

export const restaurantProfileValidationSchema = () => {
  return Yup.object().shape({
    restaurantName: Yup.string().required("Restaurant name is required..."),
    email: Yup.string()
      .email("Invalid email format...")
      .required("Email is required"),
    contact: Yup.string()
      .required("Contact is required...")
      .length(10, "Invalid contact ..."),
    description: Yup.string().required("Description is required..."),
    tableRate: Yup.number().required("Table rate is required..."),
    featuredImage: Yup.mixed().required("Featured image is required..."),
    secondaryImages: Yup.array()
      .of(Yup.mixed().required("Secondary image is required....."))
      .min(1, "At least one secondary image is required"),
    place_name: Yup.string().required("Location is required..."),
    address: Yup.string().required("Address is required..."),
    openingTime: Yup.string().required("Opening time is required..."),
    closingTime: Yup.string().required("Closing time is required..."),
    cuisines: Yup.array().of(Yup.string()).required("Cuisines are required..."),
    vegOrNonVegType: Yup.string()
      .oneOf(["veg", "non-veg", "both"])
      .required("Type is required..."),
  });
};

export const restaurantRegisterValidationSchema = () => {
  return Yup.object().shape({
    restaurantName: Yup.string()
      .required("Please enter your Restaurant name !")
      .test(
        "capitalized",
        "Restaurant name must start with a capital letter",
        (value) => {
          if (value) {
            return /^[A-Z]/.test(value);
          }
          return true;
        }
      )
      .min(2, "Please enter your Restaurant name!"),
    email: Yup.string()
      .email("Invalid email format")
      .nullable()
      .required("Please enter your email!"),
    contact: Yup.string()
      .required("Please enter your contact!")
      .matches(/^[0-9]+$/, "Invalid contact number")
      .min(10, "Invalid phone number")
      .max(10, "Invalid phone number"),
    password: Yup.string()
      .required("Please enter your password!")
      .min(
        8,
        "Password must be at least 8 characters long, one lower case , uppercase and one number."
      )
      .max(20, "Password must be less than 20 characters")
      .matches(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .matches(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .matches(/^(?=.*\d)/, "Password must contain at least one number")
      .matches(
        /^(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character"
      ),
  });
};


export const restaurantTableValidationSchema = () => {
  return Yup.object().shape({
    tableImage :  Yup.mixed().required("Image is required..."),
    tableNumber: Yup.string()
      .required("Table number is required.")
      .matches(
        /^[A-Z](?=.*\d).+$/,
        "Table name must start with a letter and one number."
      ),
    tableLocation: Yup.string().required("Please select table location."),
  });
};