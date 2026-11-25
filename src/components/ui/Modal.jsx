import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-lg font-bold text-gray-800">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
