import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, onClose}) {
    const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded font-medium ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

    return (
        <aside 
            className={`fixed inset-y-0 left-0 z-20 w-60 bg-gray-100 border-r p-4 transform transition-transform md:static md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-blue-600">TaskPulse</span>
                <button onClick={onClose} className="md:hidden text-gray-600">✕</button>
            </div>
            
            <nav className="space-y-2">
                <NavLink to="/" end className={linkClass} onClick={onClose}>
                    Dashboard
                </NavLink>
                <NavLink to="/tasks" className={linkClass} onClick={onClose}>
                    Tasks
                </NavLink>
            </nav>
        </aside>
    );
}