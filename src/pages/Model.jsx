import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { FaBrain, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaShieldAlt } from "react-icons/fa"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function Model() {
  const { user, login } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [firestoreSuccess, setFirestoreSuccess] = useState(false)

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    network: "Yes",
    prior_auth: "No",
    billing: "",
    delay: "",
    plan: "HDHP",
    procedure: "",
    diagnosis: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const predict = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("Please login to use the AI Engine.")
      return
    }

    if (!user.isPremium && user.usage >= 2) {
      setError("Free limit reached. Expand your operations with Premium.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setFirestoreSuccess(false)

    try {
      // 1. Separate Diagnostic Data from PII
      const diagnosticData = {
        age: formData.age,
        network: formData.network,
        prior_auth: formData.prior_auth,
        billing: formData.billing,
        delay: formData.delay,
        plan: formData.plan,
        procedure: formData.procedure,
        diagnosis: formData.diagnosis
      }

      // 2. Fetch Prediction from ML Backend (Safe, Anonymous Payload)
      const res = await axios.post("https://batch-1-backend.onrender.com/predict", diagnosticData)
      const aiResult = res.data
      setResult(aiResult)

      // 3. Save Full Patient Record + AI Result to Firebase database
      await addDoc(collection(db, "patient_records"), {
        patientName: formData.patientName,
        patientId: formData.patientId,
        diagnostics: diagnosticData,
        aiStatus: aiResult.status,
        denialProbability: aiResult.probability,
        riskReason: aiResult.reason || "N/A",
        timestamp: serverTimestamp(),
        processedBy: user.email || "Hospital Admin"
      })
      
      setFirestoreSuccess(true)

      const updatedUser = {
        ...user,
        usage: (user.usage || 0) + 1
      }
      login(updatedUser)
    }catch (err) {

  console.error("FULL ERROR:", err)

  // Backend error (Flask)
  if (err.response) {

    console.error("Backend Response:", err.response.data)

    setError(
      `Backend Error: ${err.response.data.error || "Unknown backend error"}`
    )

  }
  
  // Firebase error
  else if (err.code) {

    console.error("Firebase Error:", err.code)

    setError(`Firebase Error: ${err.message}`)

  }
  
  // Connection error
  else {

    console.error("Connection Error:", err)

    setError("Connection failed. Check backend or Firebase.")

  }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20 relative overflow-hidden">
      <Navbar />

      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-12 w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-6 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <FaBrain className="text-4xl text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            AI <span className="text-gradient">Claim Predictor</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg pt-2">
            Securely enter patient medical data. PII is decoupled and stripped prior to prediction. All results are securely logged to the Patient Database.
          </p>
        </div>

        <div className="card w-full shadow-[0_0_30px_rgba(30,41,59,0.5)] border-white/10 p-8 mb-10">
          <form onSubmit={predict} className="space-y-6">
            
            {/* Sec: Patient Identifier block */}
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Patient Identifiers (Kept Local)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Patient Full Name</label>
                <input
                  type="text" required
                  name="patientName" value={formData.patientName} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Patient ID / Record No.</label>
                <input
                  type="text" required
                  name="patientId" value={formData.patientId} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. PAT-9042A"
                />
              </div>
            </div>

            {/* Sec: Diagnostic Information block */}
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Diagnostic Information (Sent to AI)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Patient Age</label>
                <input
                  type="number" required min="0" max="120"
                  name="age" value={formData.age} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. 45"
                />
              </div>

              {/* Billed Amount */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Billed Amount</label>
                <input
                  type="number" required min="0" step="0.01"
                  name="billing" value={formData.billing} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. 1500.50"
                />
              </div>

              {/* In Network */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Is provider in network?</label>
                <select
                  name="network" value={formData.network} onChange={handleChange}
                  className="input-field w-full [&>option]:bg-slate-900"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Prior Auth */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Prior authorization required?</label>
                <select
                  name="prior_auth" value={formData.prior_auth} onChange={handleChange}
                  className="input-field w-full [&>option]:bg-slate-900"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Delay */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Days between service and submission</label>
                <input
                  type="number" required min="0"
                  name="delay" value={formData.delay} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. 5"
                />
              </div>

              {/* Insurance Plan */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Insurance Plan</label>
                <select
                  name="plan" value={formData.plan} onChange={handleChange}
                  className="input-field w-full [&>option]:bg-slate-900"
                >
                  <option value="HDHP">HDHP</option>
                  <option value="HMO">HMO</option>
                  <option value="POS">POS</option>
                  <option value="PPO">PPO</option>
                </select>
              </div>

              {/* Procedure Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Procedure Code</label>
                <input
                  type="text" required
                  name="procedure" value={formData.procedure} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. CPT_001"
                />
              </div>

              {/* Diagnosis Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Diagnosis Code</label>
                <input
                  type="text" required
                  name="diagnosis" value={formData.diagnosis} onChange={handleChange}
                  className="input-field w-full" placeholder="e.g. ICD_001"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-8 text-lg font-bold flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              {loading ? (
                <span className="animate-pulse">Analyzing & Logging Secure Record...</span>
              ) : (
                <>Run Secure Diagnostic <FaBrain /></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <FaExclamationTriangle className="text-red-400 shrink-0" />
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className={`mt-8 backdrop-blur-md rounded-xl border overflow-hidden shadow-lg ${result.status === 'APPROVED' ? 'bg-emerald-900/30 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
                result.status === 'DENIED' ? 'bg-red-900/30 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]' :
                  'bg-amber-900/30 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              }`}>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    {result.status === 'APPROVED' ? (
                      <FaCheckCircle className="text-emerald-400 text-3xl shrink-0 mt-1" />
                    ) : result.status === 'DENIED' ? (
                      <FaTimesCircle className="text-red-400 text-3xl shrink-0 mt-1" />
                    ) : (
                      <FaShieldAlt className="text-amber-400 text-3xl shrink-0 mt-1" />
                    )}

                    <div>
                      <p className="text-slate-300 text-sm mb-1 uppercase tracking-wider font-semibold">Diagnosis Complete for {formData.patientName}</p>
                      <p className={`font-bold text-2xl drop-shadow-sm ${result.status === 'APPROVED' ? 'text-emerald-400' :
                          result.status === 'DENIED' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                        {result.status}
                      </p>
                      <p className="text-slate-300 mt-2 font-medium">
                        Denial Probability: <span className="text-white font-bold">{result.probability}</span>
                      </p>
                    </div>
                  </div>

                  {result.status !== 'APPROVED' && (
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 flex-1 md:max-w-xs">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Detected Risk Factor</p>
                      <p className="text-slate-200 font-medium">{result.reason}</p>
                    </div>
                  )}
                </div>
              </div>

              {firestoreSuccess && (
                <div className="bg-slate-900/80 px-6 py-3 border-t border-white/5 flex items-center gap-2">
                  <FaShieldAlt className="text-cyan-400" />
                  <p className="text-sm text-slate-300 font-medium tracking-wide">Patient Record and AI Diagnostic successfully appended to secure Firebase Database.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Model
