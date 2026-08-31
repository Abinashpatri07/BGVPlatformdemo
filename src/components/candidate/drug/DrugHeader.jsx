// DrugHeader.jsx
import React from "react";

function DrugHeader() {
  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight text-[#05058D]">
        Drug Test
      </h2>

      <div className="mt-4 border border-[#8B8CFF] bg-gradient-to-r from-[#EEF0FF] to-[#f4f6ff] shadow-sm rounded-xl px-4 py-3 text-xs text-gray-800 font-medium tracking-wide">
        This Information Is Required For Compliance Purposes.
        All Information Will Be Kept Confidential
      </div>
    </>
  );
}

export default DrugHeader;