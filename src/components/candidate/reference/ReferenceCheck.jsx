import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import ReferenceForm from "./ReferenceForm";

function ReferenceCheck({ onNext }) {
  const createEmptyRef = () => ({
    name: "",
    relationship: "",
    organization: "",
    phone: "",
    email: "",
  });

  const [references, setReferences] = useState([
    createEmptyRef(),
    createEmptyRef(),
  ]);

  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    setReferences((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setError("");
  };

  const validate = () => {
    // Prof Reference: all 5 fields
    const profFields = ["name", "relationship", "organization", "phone", "email"];
    for (const key of profFields) {
      if (!String(references[0][key]).trim()) {
        setError("Please fill all required fields in Professional / Academic Reference");
        return false;
      }
    }

    // Personal Reference: email is optional, others required
    const persFields = ["name", "relationship", "phone"];
    for (const key of persFields) {
      if (!String(references[1][key]).trim()) {
        setError("Please fill all required fields in Personal / Family Reference");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setError("");
    onNext && onNext(references);
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#05058D]">Reference Check</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Please provide two references (one professional/academic and one personal/family).
        </p>
      </div>

      <div className="space-y-10 mt-6">
        <ReferenceForm
          index={0}
          data={references[0]}
          type="professional"
          onChange={handleChange}
        />
        <ReferenceForm
          index={1}
          data={references[1]}
          type="personal"
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="mt-6 text-red-500 text-sm flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={handleSubmit}
          className="bg-[#05058D] text-white px-14 py-3 rounded-xl hover:bg-blue-900 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ReferenceCheck;