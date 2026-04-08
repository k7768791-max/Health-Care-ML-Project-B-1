import Navbar from "../components/Navbar"
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa"
import { useState } from "react"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "sales",
    message: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      await addDoc(collection(db, "contact_queries"), {
        ...formData,
        timestamp: serverTimestamp(),
        read: false
      })
      setStatus("success")
      setFormData({ firstName: "", lastName: "", email: "", subject: "sales", message: "" })
    } catch (err) {
      console.error("Error submitting query:", err)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20 relative overflow-hidden">
      <Navbar />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <main className="flex-1 max-w-6xl mx-auto px-6 md:px-12 py-16 w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Touch</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions about our enterprise plans or need technical support? Our specialized team is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
          {/* Map Location iframe */}
          <div className="card overflow-hidden p-0 relative min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.3097893113974!2d-122.08385158469395!3d37.42199987982559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425def3d%3A0x83f6089bd077e6fa!2sGoogleplex!5e0!3m2!1sen!2sus!4v1684365737521!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Headquarters Location"
              className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            ></iframe>
            
            {/* Overlay Contact Info Box */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Headquarters</h3>
                  <p className="text-slate-400 text-sm">Tech Hub, CA 94043</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-cyan-400">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email Us</h3>
<a href="mailto:support@healthcareai.com" className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">support@healthcareai.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card relative">
            <h2 className="text-3xl font-bold text-white mb-6">Send us a message</h2>
            
            {status === "success" && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-center">
                Message sent successfully! Our team will get back to you shortly.
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                Failed to send message. Please try again later.
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="input w-full" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="input w-full" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Work Email</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="input w-full" placeholder="john@company.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Message subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="input w-full appearance-none text-slate-300 bg-slate-900/50">
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">How can we help?</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} className="input w-full min-h-[140px] resize-y" placeholder="Tell us a little bit about your needs..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex justify-center items-center gap-2 mt-4 text-base font-semibold shadow-lg shadow-cyan-500/20">
                {loading ? "Sending..." : "Send Message"} <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact