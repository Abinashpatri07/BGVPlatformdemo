import React, { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
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
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchExisting = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axiosInstance.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        if (response.data && response.data.references && response.data.references.length > 0) {
          const loadedRefs = [createEmptyRef(), createEmptyRef()];
          response.data.references.forEach(ref => {
            const mappedRef = {
              name: ref.cand_ref_name || "",
              relationship: ref.cand_ref_relation || "",
              organization: ref.cand_ref_org || "",
              phone: ref.cand_ref_phone || "",
              email: ref.cand_ref_email || ""
            };
            if (ref.cand_ref_type === "Organization") loadedRefs[0] = mappedRef;
            else if (ref.cand_ref_type === "Family") loadedRefs[1] = mappedRef;
          });
          setReferences(loadedRefs);
        }
      } catch (err) {
        console.error("Error fetching references:", err);
      }
    };
    fetchExisting();
  }, []);

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
    // Phone format check — Professional
    if (!/^\d{10}$/.test(String(references[0].phone).trim())) {
      setError("Contact number must be exactly 10 digits in Professional / Academic Reference");
      return false;
    }

    // Personal Reference: email is optional, others required
    const persFields = ["name", "relationship", "phone"];
    for (const key of persFields) {
      if (!String(references[1][key]).trim()) {
        setError("Please fill all required fields in Personal / Family Reference");
        return false;
      }
    }
    // Phone format check — Personal
    if (!/^\d{10}$/.test(String(references[1].phone).trim())) {
      setError("Contact number must be exactly 10 digits in Personal / Family Reference");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const payload = {
        cand_id: candId,
        references: [
          { ...references[0], type: "Organization" },
          { ...references[1], type: "Family" }
        ]
      };

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axiosInstance.post(`${API_BASE}/api/candidate/submit/reference`, payload);
      if (onNext) onNext(references);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save References.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6 flex flex-col min-h-[300px]">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Reference Check</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Please provide two references (one professional/academic and one personal/family).
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-2">
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
        <p className="mt-4 text-red-500 text-sm flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <div className="flex justify-center mt-8 mb-2">
        <button
          onClick={handleSubmit}
          className="bg-[#05058D] text-white px-10 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 text-sm"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ReferenceCheck;