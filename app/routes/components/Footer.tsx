import { NavLink } from "react-router";

export default function Footer() {
    return <div className="w-full h-[15vh] bg-[#202020] text-[#FAFAFA] flex items-center justify-center shadow mt-8">
        <div className="flex flex-col justify-start text-left w-full container mx-auto gap-[1vh] tracking-wide">
                <NavLink to="/" className="text-sm">
                    EndField Industries
                </NavLink>
                <NavLink to="/about" className="text-sm">
                    About Us
                </NavLink>
                <NavLink to="/contact" className="text-sm">
                    Contact Us: contact@endfieldindustries.com
                </NavLink>
        </div>
    </div>
}