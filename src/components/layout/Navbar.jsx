export default function Navbar({ onOpenSidebar }) {
    return (
        <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
            <button 
                onClick={onOpenSidebar}
                className="md:hidden px-2 py-1 border rounded text-gray-700"
            >
                ☰ Menu
            </button>
            <span className="font-semibold text-gray-700"> Workspace</span>
        </header>
    );
}