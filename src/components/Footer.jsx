import { Link } from "react-router-dom"
import { FaTwitter, FaLinkedin, FaGithub, FaRobot } from "react-icons/fa"

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 relative z-10 w-full overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <FaRobot className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold font-outfit tracking-wide text-white">
                Insure<span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              Empowering global healthcare providers and insurers to make instant, fraud-free, precision-driven decisions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors">
                <FaGithub className="text-lg" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} InsureAI Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-slate-400 text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
