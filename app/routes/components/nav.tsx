import { NavLink } from "react-router"
import { useState } from "react"
import "tailwindcss";


export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full bg-[#FAFAFA] text-[#202020] shadow sticky top-0 z-50">
      <div className="h-[7vh] px-2 flex items-center">
        <div className="container mx-auto flex items-center justify-between w-full">
          <NavLink to="/" className="flex items-center gap-6">
            <img
              src="https://endfield.wiki.gg/images/thumb/Endfield_Industries.png/300px-Endfield_Industries.png?800fd6"
              alt="logo"
              className="h-10 w-auto [filter:brightness(0)_saturate(100%)_invert(13%)_sepia(8%)_hue-rotate(208deg)_contrast(95%)]
              hover:[filter:brightness(0)_saturate(100%)_invert(79%)_sepia(86%)_saturate(749%)_hue-rotate(10deg)_brightness(103%)_contrast(101%)]
              transition-all duration-300"
            />
            <a className="font-bold text-[2.5vw] font-sans hover:text-[#e0d31a] hover:font-bold transition tracking-wider lg:text-[1vw] md:text-[1.5vw] sm:text-[1vw]">EndField Industries</a>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/" className="hover:text-[#e0d31a] hover:font-bold transition">
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-[#e0d31a] hover:font-bold transition">
              About
            </NavLink>
            <NavLink to="/products" className="hover:text-[#e0d31a] hover:font-bold transition">
              Products
            </NavLink>
            <NavLink to="/contact" className="hover:text-[#e0d31a] hover:font-bold transition">
              Contact
            </NavLink>
            <div>
              <input type="text" placeholder="  Search..." className="w-full h-auto bg-[#FAFAFA] text-[#202020] placeholder:text-[#808080] border border-[#CCCCCC] focus:outline-none rounded"  />
            </div>
          </nav>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-[#202020] transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-[#202020] transition-all ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-[#202020] transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FAFAFA] border-t border-gray-200">
          <nav className="flex flex-col gap-4 px-2 py-4 text-sm">
            <NavLink to="/" className="hover:text-[#e0d31a] hover:font-bold transition" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-[#e0d31a] hover:font-bold transition" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <NavLink to="/products" className="hover:text-[#e0d31a] hover:font-bold transition" onClick={() => setIsOpen(false)}>
              Products
            </NavLink>
            <NavLink to="/contact" className="hover:text-[#e0d31a] hover:font-bold transition" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
            <input type="text" placeholder="Search..." className="w-full h-10 bg-white text-[#202020] placeholder:text-[#808080] border border-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#F8F546] px-2 rounded" />
          </nav>
        </div>
      )}
    </div>
  )
}
