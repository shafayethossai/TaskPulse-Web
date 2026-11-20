import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
    const { token, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("demo@taskpulse.dev");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Already logged in -> redirect to dashboard
    if (token) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.includes("@")) {
            return setError("Please enter a valid email address");
        }
        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setSubmitting(true);
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4">
                <h1 className="text-2xl font-bold text-center text-blue-600">TaskPulse Login</h1>

                {error && (
                    <div className="p-2 text-sm bg-red-100 text-red-700 rounded"> {error} </div>
                )}
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full border rounded px-3 py-2" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                     />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Loggin in..." : "Log In"}
                </button>
            </form>

        </div>
    );
}