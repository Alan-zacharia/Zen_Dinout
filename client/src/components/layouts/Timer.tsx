import { useEffect, useState } from "react";

const Timer  = ({resendOtp} : {resendOtp : ()=>void}) => {
  const [seconds, setSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem("remainingSeconds");
    return savedSeconds ? parseInt(savedSeconds, 10) : 30;
  });
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((seconds) => {
          localStorage.setItem("remainingSeconds", String(seconds - 1));
          return seconds - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);
  const resendOtpFn = () => {
    setSeconds(30);
    localStorage.setItem("remainingSeconds", "30");
    resendOtp();
  };

  return (
    <div className="relative pt-3 pb-3">
      {seconds > 0 ? (
        <p>
          Time Remaining :
          <span className="font-semibold">
            {" "}
            00 : {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
      ) : (
        <p>Didn't recieve code?</p>
      )}

      <button
        className="underline absolute right-2 top-3"
        disabled={seconds > 0}
        style={{
          color: seconds > 0 ? "#DFE3E8" : "#FF5630",
        }}
        onClick={resendOtpFn}
      >
        Resend otp
      </button>
    </div>
  );
};

export default Timer;
