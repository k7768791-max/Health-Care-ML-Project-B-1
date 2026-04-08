import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FaRobot, FaLock, FaEnvelope } from "react-icons/fa"

function Login() {
  const { loginWithEmail, loginWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailLogin = async (e) => {
    if(e) e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await loginWithEmail(email, password)
      navigate("/admin")
    } catch (err) {
      setError(err.message || "Failed to log in")
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      await loginWithGoogle()
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Failed to log in with Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="card w-full max-w-md mx-6 relative z-10 border-white/20 shadow-[0_0_40px_rgba(14,165,233,0.1)]">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl mb-4 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            <FaRobot className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center">
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2 text-center text-sm">
            Sign in to your InsureAI account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="input pl-11 w-full" 
              placeholder="Enter your email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="input pl-11 w-full" 
              placeholder="Enter your password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm py-1">
            <label className="flex items-center text-slate-300 cursor-pointer group">
              <input type="checkbox" className="mr-2 rounded border-white/10 bg-white/5 accent-cyan-500 cursor-pointer" />
              <span className="group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In with Email"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-500 text-sm">OR</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3 text-white font-medium shadow-sm hover:shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.82 14.97.75 12 .75 7.7.75 3.99 3.22 2.18 6.93l3.66 2.84c.87-2.6 3.3-4.39 6.16-4.39z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login