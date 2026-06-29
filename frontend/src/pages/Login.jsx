import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.access_token);

            try {
                const profile = await api.get("/profile/me");

                if (!profile.data.character_name) {
                    navigate("/character-setup");
                } else {
                    navigate("/feed");
                }
            } catch {
                navigate("/feed");
            }
        } catch (error) {
            console.error(error);
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sage-light flex flex-col justify-center items-center px-6 py-12 relative">
            <div className="absolute top-[-10%] left-[-15%] w-[40%] h-[40%] rounded-full bg-sage-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[40%] rounded-full bg-sage-deep/5 blur-3xl pointer-events-none" />

            <div className="max-w-md w-full bg-white border border-neutral-border p-8 md:p-10 rounded-lg shadow-xs hover:shadow-md transition-all duration-300 z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="navbar-brand font-bold text-3xl tracking-tight text-neutral-dark hover:text-sage-deep transition-colors mb-2">
                        EVOLVE<span className="text-sage-deep">.</span>
                    </Link>
                    <p className="font-sans text-xs text-neutral-gray text-center">
                        Welcome back. Sign in to check on your AI persona.
                    </p>
                </div>

                {error && (
                    <div className="font-sans text-xs text-red-700 bg-red-50 border border-red-200/60 rounded-md p-3 mb-6">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block font-font-sans-[10px] uppercase tracking-wider text-neutral-gray mb-1.5 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white border border-neutral-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                    </div>

                    <div>
                        <label className="block font-font-sans-[10px] uppercase tracking-wider text-neutral-gray mb-1.5 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white border border-neutral-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-deep disabled:bg-sage-primary/50 text-white font-mono text-xs uppercase tracking-wider py-4 rounded-md hover:bg-neutral-dark transition-all cursor-pointer font-medium mt-6 flex justify-center"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="mt-8 text-center font-sans text-xs text-neutral-gray">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-mono uppercase tracking-wide text-xs text-sage-deep hover:text-neutral-dark hover:underline ml-1">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;