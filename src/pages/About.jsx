import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaRocket, FaShieldAlt, FaUsers, FaHospital } from "react-icons/fa"

function About() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20 relative overflow-hidden">
      <Navbar />

      {/* Decorative Blur */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <main className="flex-1 max-w-6xl mx-auto px-6 md:px-12 py-16 w-full relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Healthcare Billing</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            At HealthCareAI, we blend advanced machine learning with deep industry expertise to eliminate claim denials, accelerate patient billing, and bring transparency to the healthcare sector.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="card text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <FaRocket className="text-3xl text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">To automate 90% of routine patient billing globally, freeing up hospital staff for complex cases that require genuine care.</p>
          </div>

          <div className="card text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <FaShieldAlt className="text-3xl text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Security First</h3>
            <p className="text-slate-400 leading-relaxed">We employ military-grade encryption and strict data sovereignty principles to protect sensitive patient information.</p>
          </div>

          <div className="card text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <FaUsers className="text-3xl text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Built for Teams</h3>
            <p className="text-slate-400 leading-relaxed">Designed collaboratively with leading hospital administrators to ensure our platform fits seamlessly into existing hospital workflows.</p>
          </div>
        </div>

        {/* HOSPITAL FIRST SECTION */}
        <div className="card border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] mb-20 p-8 md:p-12 relative overflow-hidden bg-slate-900/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="flex-1">
              <div className="inline-block p-3 rounded-xl bg-blue-500/20 mb-4 border border-blue-500/30">
                <FaHospital className="text-2xl text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">A Hospital-First Approach</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-4">
                Traditional insurance systems put the burden on hospitals to decipher complex denial codes for their patients. We flip the narrative. By giving hospital administrators direct access to predictive AI, we enable absolute transparency before a claim is even officially submitted.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                When a claim is predicted to be denied, our extensive reasoning algorithms instantly log the precise risk factors directly to your internal database's patient records. This enables hospitals to proactively communicate with patients equipped with irrefutable data.
              </p>
            </div>
            
            <div className="hidden md:flex flex-col gap-4 w-full max-w-xs">
              <div className="p-4 bg-slate-950 rounded-lg border border-white/5 opacity-80 backdrop-blur-sm -translate-x-4">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Step 1</p>
                <p className="text-sm text-slate-300 font-medium">Administrator inputs diagnostic codes</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] z-10 translate-x-4">
                <p className="text-xs text-cyan-500 uppercase font-bold tracking-wider mb-1">Step 2</p>
                <p className="text-sm text-white font-medium">AI assesses risk probabilities</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-white/5 opacity-80 backdrop-blur-sm -translate-x-4">
                <p className="text-xs text-emerald-500 uppercase font-bold tracking-wider mb-1">Step 3</p>
                <p className="text-sm text-slate-300 font-medium">Record saved & patient notified</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default About