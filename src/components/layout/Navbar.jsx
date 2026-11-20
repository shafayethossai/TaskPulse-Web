import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onOpenSidebar }) {
    const { user, logout } = useAuth();
    return (
        <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onOpenSidebar}
                    className="md:hidden px-2 py-1 border rounded text-gray-700"
                >
                    ☰ Menu
                </button>
                <span className="font-semibold text-gray-700"> Workspace</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                <button 
                    onClick={logout}
                    className="text-sm px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}