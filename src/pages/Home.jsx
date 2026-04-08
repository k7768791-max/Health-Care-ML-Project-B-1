import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaChartLine, FaShieldAlt, FaBrain, FaArrowRight, FaHospitalAlt, FaLock } from "react-icons/fa"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-20 relative overflow-hidden">
      <Navbar />

      {/* Ambient glowing orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* HERO SECTION */}
      <div className="section text-center relative z-10 flex-1 flex flex-col justify-center items-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-300 text-sm font-medium tracking-wide">
          ✨ Next-Generation AI Healthcare Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mx-auto">
          Intelligent Decisions for
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text pb-2">
            Modern Healthcare
          </span>
        </h1>

        <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          Predict claim approvals instantly for patient billing with AI-powered analytics, reduce denial risks by 99%, and streamline your hospital workflow.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md mx-auto">
          <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 group">
            Start Free Trial
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/pricing" className="btn-secondary w-full text-center">
            View Pricing
          </Link>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose HealthCare<span className="text-cyan-400">AI</span></h2>
          <p className="text-slate-400 mt-4">Built for enterprise-scale reliability and speed.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="card group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <FaBrain className="text-3xl text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Predictions</h3>
            <p className="text-slate-400 leading-relaxed">Leverage cutting-edge machine learning models for accurate, split-second patient billing predictions.</p>
          </div>

          <div className="card group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <FaChartLine className="text-3xl text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Deep Analytics</h3>
<p className="text-slate-400 leading-relaxed">Unlock hidden patterns with data-driven insights tailored to your specific patient demographics.</p>
          </div>

          <div className="card group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <FaShieldAlt className="text-3xl text-indigo-400" />
            </div>
<h3 className="text-2xl font-bold text-white mb-3">Claim Denial Prevention</h3>
            <p className="text-slate-400 leading-relaxed">Proactively prevent claim denials and identify billing risks in real-time, saving millions annually.</p>
          </div>
        </div>
      </div>
      
      {/* SECTION: HOSPITAL USE CASE */}
      <div className="relative z-10 w-full bg-slate-900/50 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full"></div>
            <div className="card border-cyan-500/30 shadow-[0_0_30px_rgba(14,165,233,0.15)] bg-slate-950/80 backdrop-blur-sm relative py-12 px-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/40">
                <FaHospitalAlt className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Designed for Hospitals</h3>
              <p className="text-slate-400 text-sm">Automated workflows saving 40+ hours per week in billing departments.</p>
              
              <div className="mt-8 flex flex-col gap-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-left flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-300 text-sm font-medium">Input Diagnostic Data</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-left flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-slate-300 text-sm font-medium">AI Risk Factor Analysis</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-left flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-slate-300 text-sm font-medium">Secure Patient Record Log</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How it works for <span className="text-cyan-400">Hospitals</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Our unique workflow ensures maximum efficiency without sacrificing patient privacy. Hospital administrators simply input the required diagnosis and procedure data into the secure AI Engine portal.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The AI strips away Personally Identifiable Information (PII) before analysis, generates an instant approval forecast, and seamlessly attaches the detailed report back to your internal Firebase patient records for transparent patient communications.
            </p>
            <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-2 group">
              Start diagnosing claims <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION: SECURITY */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 w-full text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
          <FaLock className="text-3xl text-slate-300" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">Security</span></h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
          Your data security is our absolute priority. We utilize strict zero-trust architectures, end-to-end medical encryption, and isolated cloud environments to guarantee full HIPAA compliance. Diagnostic data is fully detached from patient identities during AI processing.
        </p>
      </div>

      <Footer />
    </div>
  )
}

export default Home