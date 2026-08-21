import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const PACKAGES = [
  {
    name: "Pro",
    description: "Perfect for small businesses starting with identity verification.",
    price: "₹5,000",
    units: "100 Verification Units",
    features: ["Basic ID Check", "Email Verification", "Standard Support"],
    popular: false,
  },
  {
    name: "Premium",
    description: "Our most popular tier for growing companies and HR teams.",
    price: "₹16,000",
    units: "500 Verification Units",
    features: ["Advanced ID Check", "Education Verification", "Past Employment Check", "Priority Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Comprehensive screening suite for enterprise compliance.",
    price: "₹60,000",
    units: "1500 Verification Units",
    features: ["Global Watchlist Check", "Criminal Record Check", "Financial Credit Check", "24/7 Dedicated Support"],
    popular: false,
  },
];

import { useLocation, useNavigate } from "react-router-dom";

export default function PurchaseCredits() {
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCashfree = async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
    };
    initializeCashfree();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");
    
    if (orderId) {
      const verifyPayment = async () => {
        try {
          const { data } = await axios.post("http://localhost:5000/api/client-admin/billing/verify", {
            order_id: orderId
          });
          if (data.success) {
            alert("Payment Successful! Units have been added to your balance.");
            // Remove order_id from url to prevent re-verify
            navigate("/client-admin/billing", { replace: true });
          }
        } catch (error) {
          console.error("Verification failed", error);
          alert("Payment verification failed or payment is pending.");
          navigate("/client-admin/billing", { replace: true });
        }
      };
      verifyPayment();
    }
  }, [location.search, navigate]);

  const handlePurchase = async (pkg) => {
    if (!cashfree) {
      alert("Payment gateway is loading. Please try again.");
      return;
    }
    
    setLoading(true);
    setSelectedPkg(pkg.name);
    try {
      const amount = parseInt(pkg.price.replace(/[^0-9]/g, ''), 10);
      
      const { data } = await axios.post("http://localhost:5000/api/client-admin/billing/create-order", {
        amount,
        customerName: "Client Admin User", 
        customerPhone: "9999999999", 
        customerEmail: "admin@client.com", 
        packageId: pkg.name
      }, { withCredentials: true });
      
      if (data.success && data.payment_session_id) {
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          returnUrl: "http://localhost:5173/client-admin/billing?order_id={order_id}"
        });
      } else {
        alert("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Purchase error", error);
      alert("Error initiating purchase. Please try again.");
    } finally {
      setLoading(false);
      setSelectedPkg(null);
    }
  };

  return (
    <div className="py-8">

      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Package</h2>
        <p className="text-sm text-gray-500 leading-6">
          Select The Verification Package That Best Fits Your Company's Hiring Volume.<br />
          Units Never Expire And Are Added Instantly To Your Balance.
        </p>
      </div>

      {/* Cards Row */}
      <div className="flex gap-6 justify-center items-stretch flex-wrap">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative flex flex-col flex-1 min-w-65 max-w-[320px] bg-white rounded-2xl p-7
              ${pkg.popular
                ? "border-2 border-indigo-500 shadow-md"
                : "border border-gray-200 shadow-sm"
              }`}
          >

            {/* Most Popular Badge — sits on top border */}
            {pkg.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-full tracking-widest uppercase whitespace-nowrap shadow">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Extra top spacing for popular card so content isn't hidden under badge */}
            <div className={pkg.popular ? "mt-3" : ""}>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{pkg.description}</p>

              {/* Price */}
              <p className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{pkg.price}</p>

              {/* Units Badge */}
              <div className="mb-5">
                <span className="bg-indigo-50 text-indigo-500 text-xs font-medium px-4 py-1.5 rounded-full inline-block">
                  {pkg.units}
                </span>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-5" />

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-800">
                    <span className="text-green-500 font-bold text-base">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Spacer pushes button to bottom */}
            <div className="flex-1" />

            {/* CTA Button */}
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer mt-4
                ${pkg.popular
                  ? "bg-indigo-700 text-white hover:bg-indigo-800"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                } ${loading && selectedPkg === pkg.name ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading && selectedPkg === pkg.name ? "Processing..." : "Purchase Package"}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}