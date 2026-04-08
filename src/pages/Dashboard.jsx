import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"

import {
  FaChartBar,
  FaCrown,
  FaHourglassHalf,
  FaBrain
} from "react-icons/fa"

import { Link } from "react-router-dom"

// Firebase
import { db } from "../firebase"
import {
  doc,
  getDoc
} from "firebase/firestore"

function Dashboard() {

  const { user } = useContext(AuthContext)

  const [userData, setUserData] = useState(null)

  const [loading, setLoading] = useState(true)

  // 🔥 Fetch User Data From Firestore
  useEffect(() => {

    const fetchUserData = async () => {

      try {

        if (!user?.uid) return

        const userRef =
          doc(db, "users", user.uid)

        const userSnap =
          await getDoc(userRef)

        if (userSnap.exists()) {

          setUserData(userSnap.data())

        } else {

          console.log("No user document found")

        }

      } catch (error) {

        console.error(
          "Error fetching user data:",
          error
        )

      } finally {

        setLoading(false)

      }

    }

    fetchUserData()

  }, [user])

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading Dashboard...
      </div>
    )
  }

  // 🔥 User Metrics

  const plan =
    userData?.plan || "Starter"

  const usage =
    userData?.usage || 0

  const isPremium =
    plan === "Enterprise"

  const remainingCredits =
    isPremium
      ? "Unlimited"
      : Math.max(0, 2 - usage)

  return (

    <div className="min-h-screen bg-slate-950 flex flex-col pt-20">

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">

        {/* Welcome Header */}

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">

              Welcome,
              <span className="text-cyan-400">
                {" "}
                {user?.email || "Admin"}
              </span>

            </h1>

            <p className="text-slate-400">

              Here's a quick overview of your API usage and workflows.

            </p>

          </div>

          <Link
            to="/model"
            className="btn-primary flex items-center justify-center gap-2 max-w-max shadow-cyan-500/20"
          >

            <FaBrain className="text-lg" />

            New Claim Prediction

          </Link>

        </div>

        {/* Metrics Grid */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {/* Claims Processed */}

          <div className="card group hover:-translate-y-2 transition-all duration-300">

            <div className="flex justify-between items-start mb-4">

              <p className="text-slate-400 font-medium">

                Claims Processed

              </p>

              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">

                <FaChartBar />

              </div>

            </div>

            <h2 className="text-5xl font-extrabold text-white mt-2">

              {usage}

            </h2>

            <p className="text-sm text-slate-500 mt-2">

              Total predictions used

            </p>

          </div>

          {/* Current Plan */}

          <div className="card group hover:-translate-y-2 transition-all duration-300">

            <div className="flex justify-between items-start mb-4">

              <p className="text-slate-400 font-medium">

                Current Plan

              </p>

              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">

                <FaCrown />

              </div>

            </div>

            <h2 className="text-4xl font-extrabold text-white mt-2">

              {plan}

            </h2>

            <p className="text-sm text-slate-500 mt-2">

              {isPremium
                ? "Enterprise Features Enabled"
                : "Upgrade to unlock unlimited access"}

            </p>

          </div>

          {/* Remaining Credits */}

          <div className="card group hover:-translate-y-2 transition-all duration-300">

            <div className="flex justify-between items-start mb-4">

              <p className="text-slate-400 font-medium">

                Remaining Credits

              </p>

              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">

                <FaHourglassHalf />

              </div>

            </div>

            <h2 className="text-5xl font-extrabold text-white mt-2">

              {remainingCredits}

            </h2>

            <p className="text-sm text-slate-500 mt-2">

              Credits reset monthly

            </p>

          </div>

        </div>

        {/* Upgrade Section */}

        {!isPremium && (

          <div className="card border border-cyan-500/30 bg-slate-900/60">

            <h2 className="text-xl font-bold text-white mb-3">

              Upgrade to Enterprise 🚀

            </h2>

            <p className="text-slate-400 mb-6">

              Unlock unlimited predictions and priority support.

            </p>

            <Link
              to="/pricing"
              className="btn-primary w-max"
            >

              Upgrade Now

            </Link>

          </div>

        )}

      </main>

      <Footer />

    </div>

  )
}

export default Dashboard