import { Link, useLocation } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { FaRobot, FaBars, FaTimes } from "react-icons/fa"

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" }
  ]

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/70 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            <FaRobot className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-wide text-white group-hover:text-cyan-300 transition-colors">
            Insure<span className="text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`relative py-1 transition-colors duration-300 ${location.pathname === link.path ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              )}
            </Link>
          ))}

          <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors duration-300">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-secondary !pr-5 !pl-5 !py-1.5 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary !pr-6 !pl-6 !py-2 shadow-cyan-500/20">
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-lg font-medium p-2 rounded-lg ${location.pathname === link.path ? "text-cyan-400 bg-cyan-400/10" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-full bg-white/10 my-2"></div>
          {user ? (
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="text-lg font-medium p-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn-secondary w-full text-center">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar