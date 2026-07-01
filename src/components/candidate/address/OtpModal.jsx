import { useState, useRef } from "react";
import { verifyAadhaarOtp, pollTaskStatus } from "../../../API/ocrApi";

export default function OtpModal({
  open,
  onClose,
  onVerify,
  taskId,
  aadhaar
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef([]);

  if (!open) return null;

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace -> previous field
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const submitOtp = async () => {
    const finalOtp = otp.join("");
    
    if (finalOtp.length !== 6) {
      setError(true);
      setErrorMessage("Please enter a 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      setError(false);
      setErrorMessage("");

      const verifyRes = await verifyAadhaarOtp(finalOtp, taskId);
      
      if (verifyRes.error) {
        setError(true);
        setErrorMessage(verifyRes.error);
        setIsVerifying(false);
        return;
      }

      const verifyRequestId = verifyRes[0]?.request_id;
      if (!verifyRequestId) {
        setError(true);
        setErrorMessage("Failed to initiate verification.");
        setIsVerifying(false);
        return;
      }

      // Poll up to 6 times
      let isCompleted = false;
      let pollingData = null;

      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const statusRes = await pollTaskStatus(verifyRequestId);
        
        const taskInfo = statusRes[0];
        if (taskInfo && taskInfo.status === "completed") {
          isCompleted = true;
          pollingData = taskInfo.result?.extraction_output || {};
          break;
        } else if (taskInfo && taskInfo.status === "failed") {
          setError(true);
          setErrorMessage("Verification failed: " + taskInfo.message);
          setIsVerifying(false);
          return;
        }
      }

      if (isCompleted && pollingData) {
        // IDfy typically returns fields like name_on_card, date_of_birth, gender, and address object
        // Map the address object for the UI
        const addressObj = pollingData.address || {};
        const formattedAddress = {
          house_number: addressObj.house_number || "",
          street_address: addressObj.street_address || "",
          locality: addressObj.locality || "",
          city: addressObj.city || addressObj.district || "",
          state: addressObj.state || "",
          pincode: addressObj.pincode || ""
        };

        onVerify(formattedAddress);
      } else {
        setError(true);
        setErrorMessage("Verification timed out. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Error verifying OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white w-162.5 rounded-3xl border border-indigo-400 px-10 py-8">
        
        <h2 className="text-3xl font-bold text-center text-indigo-900">
          Verify your Aadhar Details
        </h2>

        <p className="text-center text-indigo-700 mt-5">
          OTP send to your Aadhar register mobile no
        </p>

        <p className="text-center text-indigo-800 font-medium mt-1">
          {aadhaar ? `Aadhaar ending in ${aadhaar.slice(-4)}` : ""}
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-4 mt-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className={`w-14 h-14 text-center text-2xl rounded-xl border outline-none ${
                error
                  ? "border-red-500"
                  : "border-indigo-700"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-red-500 mt-5">
            {errorMessage || "The OTP you entered is invalid"}
          </p>
        )}

        <p className="text-center text-2xl font-semibold text-indigo-900 mt-8">
          Don’t Get OTP?
        </p>

        <p className="text-center text-indigo-800 mt-1 cursor-pointer">
          Resend Code
        </p>

        <div className="flex justify-center mt-6">
          <button
            onClick={submitOtp}
            disabled={isVerifying}
            className={`px-8 h-11 bg-indigo-900 text-white rounded-xl ${isVerifying ? 'opacity-70' : 'hover:bg-indigo-800'}`}
          >
            {isVerifying ? "Verifying..." : "Submit otp"}
          </button>
        </div>
      </div>
    </div>
  );
}