import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Model from "./pages/Model"
import Pricing from "./pages/Pricing"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/model" element={
          <ProtectedRoute>
            <Model />
          </ProtectedRoute>
        } />

         <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRole="admin">
          <Admin />
        </ProtectedRoute>
      }
    />

      </Routes>
    </BrowserRouter>
  )
}

export default App