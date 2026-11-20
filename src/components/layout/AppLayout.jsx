import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
    const [sidebarOpen, setsidebarOpen] = useState(false);
    
    return (
        <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setsidebarOpen(false)} />
                
            <div className="flex flex-col">
                <Navbar onOpenSidebar={() => setsidebarOpen(true)}/>
                <main className="p-6 flex-1">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}