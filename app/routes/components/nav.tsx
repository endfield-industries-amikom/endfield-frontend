import { NavLink } from "react-router"
import "tailwindcss";
export default function Nav() {
    return (
<div className="w-full h-16 bg-gray-800 text-whiteitems-center justify-between px-4">
    <div className="container mx-auto flex items-center justify-between">
        <div>
            <a href="/">
                <img src="https://endfield.wiki.gg/images/thumb/Endfield_Industries.png/300px-Endfield_Industries.png?800fd6" alt="logo" className="w-[autovw] h-[autovh]"/>
            </a>
        </div>
        <nav>
            <span>
                <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500" : "text-white"}>Home</NavLink>
            </span>
            <span className="ml-4">
                <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-500" : "text-white"}>About</NavLink>
            </span>
            <span className="ml-4">
                <NavLink to="/products" className={({ isActive }) => isActive ? "text-blue-500" : "text-white"}>Products</NavLink>
            </span>
            <span className="ml-4">
                <NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-500" : "text-white"}>Contact</NavLink>
            </span>
        </nav>
    </div>
</div>
    )
}