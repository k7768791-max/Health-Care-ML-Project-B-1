import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaCheck } from "react-icons/fa"
import { useState } from "react"

// Firebase
import { db, auth } from "../firebase"
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore"

// Load Razorpay Script
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Pricing() {

  const [loading, setLoading] = useState(false)

  // 🔥 Payment Function
  const handlePayment = async () => {

    setLoading(true)

    // Load Razorpay SDK
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    )

    if (!res) {
      alert("Razorpay SDK failed to load.")
      setLoading(false)
      return
    }

    // Get Logged-in User
    const user = auth.currentUser

    if (!user) {
      alert("User not logged in.")
      setLoading(false)
      return
    }

    const options = {

      key: "rzp_test_RqzWeEJxvsKy4n",

      amount: "29900", // ₹299

      currency: "INR",

      name: "HealthCareAI Enterprise",

      description:
        "Upgrade to Enterprise Plan",

      // 🔥 Payment Success Handler
      handler: async function (response) {

        try {

          const paymentId =
            response.razorpay_payment_id

          alert(
            `Payment Successful! ID: ${paymentId}`
          )

          // =========================
          // SAVE PAYMENT DETAILS
          // =========================

          await addDoc(
            collection(db, "payments"),
            {

              userId: user.uid,

              email: user.email,

              paymentId: paymentId,

              amount: 299,

              currency: "INR",

              plan: "Enterprise",

              status: "success",

              timestamp: serverTimestamp()

            }
          )

          // =========================
          // UPDATE USER PLAN
          // =========================

          await updateDoc(
            doc(db, "users", user.uid),
            {

              plan: "Enterprise",

              subscriptionStatus: "active",

              predictionsLimit: "unlimited",

              upgradedAt: serverTimestamp()

            }
          )

          alert(
            "🎉 Plan upgraded successfully!"
          )

        } catch (error) {

          console.error(
            "Payment Save Error:",
            error
          )

          alert(
            "Payment succeeded but saving failed. Check console."
          )
        }

      },

      prefill: {

        name:
          user.displayName ||
          "Hospital Administrator",

        email: user.email,

        contact: "9999999999"

      },

      theme: {

        color: "#0ea5e9"

      }

    }

    const paymentObject =
      new window.Razorpay(options)

    paymentObject.on(
      "payment.failed",
      function (response) {

        alert(
          `Payment Failed: ${response.error.description}`
        )
      }
    )

    paymentObject.open()

    setLoading(false)
  }

  return (

    <div className="min-h-screen bg-slate-950 flex flex-col pt-20 relative overflow-hidden">

      <Navbar />

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 w-full flex-1">

        {/* Header */}
        <div className="text-center mb-16">

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">

            Simple,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {" "}Transparent
            </span>
            {" "}Pricing

          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">

            Get started for free, then rapidly
            scale to enterprise-grade capabilities.

          </p>

        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">

          {/* Starter Plan */}
          <div className="card flex flex-col w-full h-full">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-white">
                Starter
              </h2>

              <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">

                ₹0
                <span className="text-xl font-medium text-slate-400 ml-1">
                  /mo
                </span>

              </div>

              <p className="text-slate-400 mt-4 leading-relaxed">

                Perfect for testing the waters.

              </p>

            </div>

            <ul className="space-y-4 mb-8 flex-1">

              <li className="flex items-center gap-3 text-slate-300">

                <FaCheck className="text-cyan-400 shrink-0" />

                2 AI Predictions per month

              </li>

              <li className="flex items-center gap-3 text-slate-300">

                <FaCheck className="text-cyan-400 shrink-0" />

                Basic Claim Risk Analysis

              </li>

              <li className="flex items-center gap-3 text-slate-300">

                <FaCheck className="text-cyan-400 shrink-0" />

                Community Support

              </li>

            </ul>

            <button className="btn-secondary w-full py-3 mt-auto cursor-default opacity-80">

              Current Plan

            </button>

          </div>

          {/* Enterprise Plan */}
          <div className="card flex flex-col relative sm:scale-[1.02] border-cyan-500/30 shadow-[0_0_30px_rgba(14,165,233,0.15)] bg-slate-900/60 transition-transform hover:-translate-y-1 w-full h-full">

            <div className="absolute top-0 right-8 transform -translate-y-1/2">

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex shadow-lg">

                Most Popular

              </span>

            </div>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-white">
                Enterprise
              </h2>

              <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">

                ₹299
                <span className="text-xl font-medium text-slate-400 ml-1">
                  /mo
                </span>

              </div>

              <p className="text-slate-400 mt-4 leading-relaxed">

                Unlimited processing power for heavy workloads.

              </p>

            </div>

            <ul className="space-y-4 mb-8 flex-1">

              <li className="flex items-center gap-3 text-white">

                <FaCheck className="text-blue-400 shrink-0" />

                Unlimited AI Predictions

              </li>

              <li className="flex items-center gap-3 text-white">

                <FaCheck className="text-blue-400 shrink-0" />

                Advanced Neural Models

              </li>

              <li className="flex items-center gap-3 text-white">

                <FaCheck className="text-blue-400 shrink-0" />

                Dedicated Manager

              </li>

              <li className="flex items-center gap-3 text-white">

                <FaCheck className="text-blue-400 shrink-0" />

                24/7 Support

              </li>

            </ul>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary w-full py-3 shadow-[0_0_20px_rgba(14,165,233,0.3)] mt-auto"
            >

              {loading
                ? "Initializing..."
                : "Upgrade Now"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  )
}

export default Pricing