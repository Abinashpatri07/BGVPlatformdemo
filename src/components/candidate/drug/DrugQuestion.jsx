// DrugQuestion.jsx
import React from "react";

function DrugQuestion({
  question,
  options,
  selected,
  onSelect,
}) {
  return (
    <>
      <h3 className="mt-6 text-sm font-semibold tracking-wide text-[#05058D]">
        {question}
      </h3>

      <div className="mt-3 space-y-3">
        {options.map((item) => (
          <label
            key={item.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="drug-test"
              checked={selected === item.value}
              onChange={() => onSelect(item.value)}
              className="h-4 w-4 accent-[#05058D] cursor-pointer"
            />

            <span className="text-sm text-gray-700 font-medium group-hover:text-[#05058D] transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}

export default DrugQuestion;