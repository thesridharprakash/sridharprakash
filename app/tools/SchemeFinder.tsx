"use client";

import { useState } from "react";

type CitizenInput = {
  age: number | "";
  income: number | "";
  category: string;
};

type Scheme = {
  name: string;
  description: string;
  eligibility: string;
};

const schemes: Scheme[] = [
  {
    name: "Scholarship for Students",
    description: "Financial support for students from low-income families.",
    eligibility: "age <= 25, income <= 500000",
  },
  {
    name: "Senior Citizen Pension",
    description: "Monthly pension for citizens above 60 years of age.",
    eligibility: "age >= 60",
  },
  {
    name: "Women Empowerment Grant",
    description: "Support for women entrepreneurs and self-help groups.",
    eligibility: "category === 'female'",
  },
];

export default function SchemeFinder() {
  const [input, setInput] = useState<CitizenInput>({
    age: "",
    income: "",
    category: "",
  });

  const [eligibleSchemes, setEligibleSchemes] = useState<Scheme[]>([]);
  const [copiedScheme, setCopiedScheme] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "income"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filtered = schemes.filter((scheme) => {
      let isEligible = true;

      if (scheme.eligibility.includes("age") && input.age !== "") {
        if (scheme.eligibility.includes(">=")) {
          const minAge = Number(
            scheme.eligibility.match(/age >= (\d+)/)?.[1]
          );
          if (input.age < minAge) isEligible = false;
        } else if (scheme.eligibility.includes("<=")) {
          const maxAge = Number(
            scheme.eligibility.match(/age <= (\d+)/)?.[1]
          );
          if (input.age > maxAge) isEligible = false;
        }
      }

      if (scheme.eligibility.includes("income") && input.income !== "") {
        const maxIncome = Number(
          scheme.eligibility.match(/income <= (\d+)/)?.[1]
        );
        if (input.income > maxIncome) isEligible = false;
      }

      if (scheme.eligibility.includes("category") && input.category !== "") {
        const requiredCategory = scheme.eligibility.match(
          /category === '(\w+)'/
        )?.[1];
        if (input.category !== requiredCategory) isEligible = false;
      }

      return isEligible;
    });

    setEligibleSchemes(filtered);
    setCopiedScheme(null); // Reset copied state
  };

  const copySchemeInfo = (scheme: Scheme) => {
    const textToCopy = `${scheme.name}: ${scheme.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedScheme(scheme.name);
    setTimeout(() => setCopiedScheme(null), 2000);
  };

  const shareScheme = (
    scheme: Scheme,
    platform: "whatsapp" | "x" | "facebook"
  ) => {
    const text = encodeURIComponent(`${scheme.name}: ${scheme.description}`);
    const url = encodeURIComponent(window.location.href);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Government Scheme Finder
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={input.age}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Annual Income (₹)
          </label>
          <input
            type="number"
            name="income"
            value={input.income}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="category"
            value={input.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Find Schemes
        </button>
      </form>

      {eligibleSchemes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            Eligible Schemes:
          </h3>
          <ul className="space-y-3">
            {eligibleSchemes.map((scheme, idx) => (
              <li
                key={idx}
                className="border border-gray-200 p-3 rounded bg-gray-50"
              >
                <h4 className="font-semibold">{scheme.name}</h4>
                <p className="text-gray-700">{scheme.description}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => copySchemeInfo(scheme)}
                    className={`px-3 py-1 rounded text-white text-sm font-medium transition
                      ${copiedScheme === scheme.name ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {copiedScheme === scheme.name ? "Copied!" : "Copy Info"}
                  </button>

                  <button
                    onClick={() => shareScheme(scheme, "whatsapp")}
                    className="px-3 py-1 rounded text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={() => shareScheme(scheme, "x")}
                    className="px-3 py-1 rounded text-white text-sm font-medium bg-black hover:bg-gray-800 transition"
                  >
                    X
                  </button>

                  <button
                    onClick={() => shareScheme(scheme, "facebook")}
                    className="px-3 py-1 rounded text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Facebook
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {eligibleSchemes.length === 0 && input.age !== "" && (
        <p className="mt-4 text-gray-500">No schemes match your criteria.</p>
      )}
    </div>
  );
}
