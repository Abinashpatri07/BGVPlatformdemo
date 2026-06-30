import { useState } from "react";
import OtpModal from "./OtpModal";
import UploadBox from "./UploadBox";
import UploadSuccess from "./UploadSuccess";
import PermanentAddressSection from "./PermanentAddressSection";


export default function AddressStep({ onNext }) {
  const [aadhaar, setAadhaar] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  const [addressType, setAddressType] = useState("");
  const [radioError, setRadioError] = useState(false);

  const [sameAddress, setSameAddress] = useState("");
  const [sameError, setSameError] = useState(false);

  const [showUpload, setShowUpload] = useState(false);

  const [uploaded, setUploaded] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [fileName, setFileName] = useState("");

  

  const handleSubmit = () => {
  // First click = open OTP
  if (!verified) {
    if (aadhaar.trim().length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar Number");
      return;
    }

    setShowOtp(true);
    return;
  }

  // Require address type
  if (!addressType) {
    setRadioError(true);
    return;
  }

  // Require same address
  if (!sameAddress) {
    setSameError(true);
    return;
  }

  setRadioError(false);
  setSameError(false);

  // If No and file not uploaded => show upload box
  if (sameAddress === "no" && !uploaded) {
    setShowUpload(true);
    return;
  }

  // If Yes OR uploaded successfully => next page
  onNext();
};

  const handleOtpSuccess = () => {
    setShowOtp(false);
    setVerified(true);
  };

  const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const validTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  if (!validTypes.includes(file.type)) {
    setUploadError(true);
    setUploaded(false);
    return;
  }

  setFileName(file.name);
  setUploadError(false);
  setUploaded(true);
};

const getMaskedAadhaar = (val) => {
  if (val.length <= 4) return val;
  const maskedLength = val.length - 4;
  return "*".repeat(maskedLength) + val.slice(-4);
};

  return (
    <>
      <main className="bg-white rounded-2xl shadow-sm w-190 min-h-140 px-6 py-5">
        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#101A78]">Address Details</h1>

        {/* Top Info */}
        <div className="mt-5 rounded-xl border border-[#6E72E8] bg-[#EEF0FF] px-5 py-4">
          <p className="text-sm">
            <b>Step 1:</b> Enter Your Aadhaar Number To Receive An OTP
          </p>
          <p className="text-sm mt-1">
            <b>Step 2:</b> Verify The OTP To Fetch Your Address Details
          </p>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-[18px] font-semibold text-[#101A78]">Address</h2>

        {/* Aadhaar */}
        <label className="block mt-4 text-sm font-medium">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={isFocused ? aadhaar : getMaskedAadhaar(aadhaar)}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 12);
            setAadhaar(val);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="2521 5879 5684"
          className="mt-1 w-full h-9 rounded border border-gray-300 px-3 text-sm"
        />

        {/* NOTE = before verify only */}
        {!verified && (
          <div className="mt-6 rounded-xl border border-[#6E72E8] px-4 py-3">
            <h3 className="text-[16px] font-medium text-black">Note:</h3>
            <p className="mt-1 text-[14px] text-gray-700 leading-5">
              Securely Verifies Your Identity Via Aadhaar For Easy Access,
              Updates, And Safe Digital Services.
            </p>
          </div>
        )}

        {/* Fields = after verify only */}
        {verified && (
          <>
            <p className="text-green-600 text-[11px] mt-1">✔ Aadhaar Verified</p>

            <label className="block mt-2 text-sm">
              House and Apartment Number <span className="text-red-500">*</span>
            </label>
            <input
              value="G-501"
              readOnly
              className="mt-1 w-full h-9 rounded border px-3 text-sm"
            />

            <label className="block mt-2 text-sm">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              value="Kula Layout, Sanjib Nagar 3 Rd Phase"
              readOnly
              className="mt-1 w-full h-9 rounded border px-3 text-sm"
            />

            <label className="block mt-2 text-sm">
              Address Line 2 <span className="text-red-500">*</span>
            </label>
            <input
              value="Jaynagar Layout, 3rd Phase, Kulugate, Bangalore"
              readOnly
              className="mt-1 w-full h-9 rounded border px-3 text-sm"
            />

            <label className="block mt-2 text-sm">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              value="562214"
              readOnly
              className="mt-1 w-full h-9 rounded border px-3 text-sm"
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value="Bangalore"
                  readOnly
                  className="mt-1 w-full h-9 rounded border px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  value="Karnataka"
                  readOnly
                  className="mt-1 w-full h-9 rounded border px-3 text-sm"
                />
              </div>
            </div>

            {/* Address Type Required */}
            <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="present"
                  checked={addressType === "present"}
                  onChange={(e) => {
                    setAddressType(e.target.value);
                    setRadioError(false);
                  }}
                />
                <span>
                  Present Address <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="permanent"
                  checked={addressType === "permanent"}
                  onChange={(e) => {
                    setAddressType(e.target.value);
                    setRadioError(false);
                  }}
                />
                <span>
                  Permanent Address <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {radioError && (
              <p className="text-red-500 text-xs mt-2">
                Please choose Present or Permanent Address.
              </p>
            )}

            {/* Same Address Required */}
            <div className="flex justify-between mt-3 text-xs items-center">
              <p>
                Is Your Permanent Address Same As Your Present Address
                <span className="text-red-500 ml-1">*</span>
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="same"
                    value="yes"
                    checked={sameAddress === "yes"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSameAddress(value);
                      setSameError(false);
                      setShowUpload(false);
                    }}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="same"
                    value="no"
                    checked={sameAddress === "no"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSameAddress(value);
                      setSameError(false);
                      setShowUpload(true);
                    }}
                  />
                  No
                </label>
              </div>
            </div>

            {sameError && (
              <p className="text-red-500 text-xs mt-2">
                Please choose Yes or No to continue.
              </p>
            )}
            {/* Upload Box Before Success */}
              {showUpload && !uploaded && (
                <UploadBox
                  title="Present Address"
                  onUpload={handleFileUpload}
                  showError={uploadError}
                />
              )}

              {/* After Upload Success */}
              {uploaded && (
                <>
                  <UploadSuccess
                    fileName={fileName}
                    fileSize="Uploaded"
                    onChangeFile={() => {
                      setUploaded(false);
                      setUploadError(false);
                    }}
                  />

                  <PermanentAddressSection />
                </>
              )}
          </>
        )}

        {/* Submit */}
        <div className="flex justify-center mt-5">
          <button
            onClick={handleSubmit}
            className="w-28 h-9 rounded-xl bg-[#05058D] text-white text-sm"
          >
            Submit
          </button>
        </div>
      </main>

      {/* OTP Modal */}
      <OtpModal
        open={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleOtpSuccess}
      />
    </>
  );
}
