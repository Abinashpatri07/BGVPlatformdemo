import React from "react";

function Field({ label, value, verified = false }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1 text-gray-500">
        {label}
      </label>

      <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50 flex justify-between items-center gap-2 hover:bg-white transition-colors">
        <span className="text-sm text-gray-800 font-medium break-words">{value || "N/A"}</span>

        {verified && (
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight text-[#05058D] mb-4 border-b pb-2 flex items-center justify-between">
        <span>{title}</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function ReviewContent({ candidateData }) {
  if (!candidateData) return null;
  const { basicInfo, address, idDocs, education, employment, drugTest, criminal, references } = candidateData;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB');
  };

  const getDocName = (type) => {
    switch (type) {
      case 1: return "PAN";
      case 2: return "Aadhaar";
      case 3: return "Passport";
      case 4: return "Driving License";
      case 5: return "Voter ID";
      default: return "ID Document";
    }
  };

  return (
    <div>
      {/* Personal Information */}
      {basicInfo && (basicInfo.candidate_first_name || basicInfo.candidate_email || basicInfo.name || basicInfo.email) && (
        <Section title="Personal Information">
          <Field 
            label="Full Name" 
            value={
              [basicInfo.candidate_first_name, basicInfo.candidate_last_name]
                .filter(Boolean)
                .join(" ") || basicInfo.name || "N/A"
            } 
          />
          <Field label="Email Address" value={basicInfo.candidate_email || basicInfo.email || "N/A"} />
          <Field label="Mobile Number" value={basicInfo.candidate_mobile || basicInfo.phone || "N/A"} />
          {basicInfo.candidate_dob && (
            <Field label="Date of Birth" value={formatDate(basicInfo.candidate_dob)} />
          )}
          {basicInfo.candidate_gender && (
            <Field 
              label="Gender" 
              value={basicInfo.candidate_gender === 1 ? "Male" : basicInfo.candidate_gender === 2 ? "Female" : basicInfo.candidate_gender === 3 ? "Other" : basicInfo.candidate_gender} 
            />
          )}
          {basicInfo.candidate_father_name && (
            <Field label="Father's Name" value={basicInfo.candidate_father_name} />
          )}
          <Field 
            label="Total Experience" 
            value={
              basicInfo.candidate_experience !== undefined && basicInfo.candidate_experience !== null
                ? `${basicInfo.candidate_experience} Year${basicInfo.candidate_experience > 1 ? 's' : ''}`
                : "Fresher"
            } 
          />
          {basicInfo.candidate_function && (
            <Field label="Department / Function" value={basicInfo.candidate_function} />
          )}
        </Section>
      )}

      {/* Permanent Address */}
      <Section title="Permanent Address">
        <Field label="Address" value={address?.permanent_address || "N/A"} />
        <Field label="City" value={address?.permanent_city || "N/A"} />
        <Field label="State" value={address?.permanent_state || "N/A"} />
        <Field label="Pin Code" value={address?.permanent_zipcode || "N/A"} />
      </Section>

      {/* Present Address */}
      <Section title="Present Address">
        <Field label="Address" value={address?.candidate_current_address || "N/A"} />
        <Field label="City" value={address?.current_city || "N/A"} />
        <Field label="State" value={address?.current_state || "N/A"} />
        <Field label="Pin Code" value={address?.current_zipcode || "N/A"} />
      </Section>

      {/* ID Documents */}
      {idDocs && idDocs.length > 0 && (
        <Section title="ID Documents">
          {idDocs.map((doc, idx) => {
            let docNumber = "N/A";
            if (doc.cand_iden_type === "PAN card" || doc.cand_iden_type === "PAN") docNumber = doc.pan_number;
            else if (doc.cand_iden_type === "Driving license" || doc.cand_iden_type === "Driving License") docNumber = doc.driving_number;
            else if (doc.cand_iden_type === "Voter ID") docNumber = doc.voter_number;
            else if (doc.cand_iden_type === "Passport") docNumber = doc.passport_number;
            else if (doc.cand_iden_type === "Aadhaar" || doc.cand_iden_type === "Aadhaar card") docNumber = doc.aadhaar_number || doc.pan_number;
            else if (doc.uan_number) docNumber = doc.uan_number;
            else if (doc.cand_iden_type === "UAN") docNumber = doc.uan_number;

            return (
              <Field 
                key={idx} 
                label={doc.cand_iden_type || `Document ${idx+1}`} 
                value={docNumber || "N/A"} 
                verified={doc.iden_verification_status === 1} 
              />
            );
          })}
        </Section>
      )}

      {/* Employment */}
      <Section title="Employment Details">
        {employment && employment.length > 0 ? employment.map((emp, idx) => (
          <React.Fragment key={idx}>
            <h4 className="col-span-1 sm:col-span-2 md:col-span-3 font-medium text-[#101A78] mt-2 mb-1 border-b pb-2">
              {emp.cand_emp_type || `Employment ${idx + 1}`}
            </h4>
            <Field label="Company Name" value={emp.cand_emp_company || "N/A"} />
            <Field label="Employee ID" value={emp.cand_emp_empid || "N/A"} />
            <Field label="Designation" value={emp.cand_emp_designation || "N/A"} />
            <Field label="Start Date" value={formatDate(emp.cand_emp_from_date)} />
            <Field label="End Date" value={formatDate(emp.cand_emp_to_date)} />
          </React.Fragment>
        )) : <p className="text-sm text-gray-500 col-span-1 sm:col-span-2 md:col-span-3">No employment details added.</p>}
      </Section>

      {/* Education */}
      <Section title="Education Details">
        {education && education.length > 0 ? education.map((edu, idx) => (
          <React.Fragment key={idx}>
            <h4 className="col-span-1 sm:col-span-2 md:col-span-3 font-medium text-[#101A78] mt-2 mb-1 border-b pb-2">
              {edu.cand_edu_dgree || edu.cand_edu_type || `Education ${idx + 1}`}
            </h4>
            <Field label="Institute Name" value={edu.cand_edu_institute || "N/A"} />
            <Field label="Start Date" value={formatDate(edu.cand_edu_from_date)} />
            <Field label="End Date" value={formatDate(edu.cand_edu_to_date)} />
            <Field label="Course" value={edu.cand_specialization || "N/A"} />
            <Field label="Percentage/CGPA" value={edu.cand_edu_grade || "N/A"} />
          </React.Fragment>
        )) : <p className="text-sm text-gray-500 col-span-1 sm:col-span-2 md:col-span-3">No education details added.</p>}
      </Section>

      {/* Drug Test */}
      <Section title="Drug Test Details">
        {drugTest ? (
          <>
            <Field label="Taken Drug Test?" value={drugTest.cand_drug_test || "N/A"} />
            {drugTest.cand_drug_test === "Yes" && (
              <>
                <Field label="Date of Test" value={formatDate(drugTest.cand_drug_date)} />
                <Field label="Remarks" value={drugTest.cand_drug_remarks || "N/A"} />
              </>
            )}
          </>
        ) : <p className="text-sm text-gray-500 col-span-1 sm:col-span-2 md:col-span-3">No drug test details submitted.</p>}
      </Section>

      {/* Criminal */}
      <Section title="Criminal Check">
        {criminal ? (
          <>
            <Field label="Has Criminal Record?" value={criminal.cand_crim_record || "N/A"} />
            {criminal.cand_crim_record === "Yes" && (
              <Field label="Details" value={criminal.cand_crim_remarks || "N/A"} />
            )}
          </>
        ) : <p className="text-sm text-gray-500 col-span-1 sm:col-span-2 md:col-span-3">No criminal check details submitted.</p>}
      </Section>

      {/* Reference */}
      <Section title="Reference Check">
        {references && references.length > 0 ? references.map((ref, idx) => (
          <React.Fragment key={idx}>
            <h4 className="col-span-1 sm:col-span-2 md:col-span-3 font-medium text-[#101A78] mt-2 mb-1 border-b pb-2">
              {ref.cand_ref_type || `Reference ${idx + 1}`}
            </h4>
            <Field label="Name" value={ref.cand_ref_name || "N/A"} />
            <Field label="Relationship" value={ref.cand_ref_relation || "N/A"} />
            <Field label="Contact Number" value={ref.cand_ref_phone || "N/A"} />
            <Field label="Email Address" value={ref.cand_ref_email || "N/A"} />
            {ref.cand_ref_org && (
              <Field label="Organization" value={ref.cand_ref_org} />
            )}
          </React.Fragment>
        )) : <p className="text-sm text-gray-500 col-span-1 sm:col-span-2 md:col-span-3">No references added.</p>}
      </Section>
    </div>
  );
}

export default ReviewContent;