// 📁 src/pages/PaymentForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import CarWheelLoader from "../components/CarWheelLoader";

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    license: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // ⏳ Step 1: Create Razorpay Order using bookingId
      const { data } = await axios.post("/api/payment/create-order", {
        bookingId,
        customer: form,
      });

      if (!data.success) {
        toast.error(data.message || "Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount, // from backend
        currency: data.order.currency,
        name: "Royal Cars",
        description: "Car Rental Payment",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            toast.success("Payment Successful ✅");

            // Step 2: Save Payment Info
            await axios.post("/api/payment/save-transaction", {
              bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 3: Redirect
            navigate("/my-bookings");
          } catch (err) {
            console.error("Save error:", err);
            toast.error(
              "Payment succeeded but failed to save. Contact support."
            );
            navigate("/my-bookings");
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading overlay during payment processing
  if (loading) {
    return <CarWheelLoader />;
  }

  return (
    <form
      onSubmit={handlePayment}
      className="max-w-md mx-auto mt-16 p-6 shadow-md rounded-lg space-y-4 border border-borderColor"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        Complete Your Details
      </h2>

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
        readOnly
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
        readOnly
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
        readOnly
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="license"
        placeholder="Driving License Number"
        value={form.license}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-primary text-white py-3 rounded hover:bg-primary-dull transition ${
          loading ? "opacity-60 cursor-wait" : ""
        }`}
      >
        {loading ? "Processing Payment..." : "Pay with Razorpay"}
      </button>
    </form>
  );
};

export default PaymentForm;
