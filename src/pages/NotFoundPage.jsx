import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="p-6">
            <h1 className="test-2xl font-bold ml-4">404 - Pgae Not Found</h1>
            <Link to="/" className="text-blue-600 underline">Go Home</Link>
        </div>
    );
}