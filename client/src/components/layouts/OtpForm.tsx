import OTPInput from "react-otp-input";
import OtpTimer from "../layouts/Timer";
import { useFormik } from "formik";
import useOtp from "../../hooks/useOtp";
import { validateOtp } from "../../utils/validations";

const OtpForm = ({
  otpData,
  onOtpVerified,
  resendOtp,
}: {
  otpData: string | null;
  onOtpVerified: () => void;
  resendOtp: () => void;
}) => {
  const { otpButtonLoading, otpErrors, otpFunction } = useOtp();
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validate: validateOtp,
    onSubmit: async (res: { otp: string }) => {
      try {
        const isOtpVerified = await otpFunction(res.otp, otpData);
        if (isOtpVerified) {
          onOtpVerified();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleOtpChange = (otp: string) => {
    formik.setFieldValue("otp", otp);
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow h-[400px]">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">Enter Otp</h3>
        </div>
        <div className="flex justify-center p-10 w-full">
          <form onSubmit={formik.handleSubmit}>
            <div className="pb-5">
              <p className="font-bold text-sm text-purple-400 pb-5">
                Your Verification code has been sent to your email, please enter
                it here to update.
              </p>
              {!otpErrors && formik.touched.otp && formik.errors.otp ? (
                <div className="text-red-500 pb-3">{formik.errors.otp}</div>
              ) : (
                <div className="text-red-500 pb-3">{otpErrors}</div>
              )}

              <OTPInput
                value={formik.values.otp}
                onChange={handleOtpChange}
                numInputs={6}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    type="number"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      marginRight: "13px",
                      border: "1px solid #ccc",
                      borderRadius: "2px",
                      borderColor: "green",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              />
              <OtpTimer resendOtp={resendOtp} />

              <button
                className="shadow-lg shadow-gray-500 bg-orange-400  py-3 w-full"
                type="submit"
                disabled={otpButtonLoading}
              >
                {otpButtonLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
