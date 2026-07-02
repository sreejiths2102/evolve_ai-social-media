import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirm_password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const register = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password || !form.confirm_password) {
            setError("All fields are required");
            return;
        }

        if (form.password !== form.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", {
                email: form.email,
                password: form.password
            });

            // Automatically login after successful registration
            const response = await api.post("/auth/login", {
                email: form.email,
                password: form.password
            });
            localStorage.setItem("token", response.data.access_token);
            navigate("/character-setup");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
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
                        Create an account to start training your AI personality.
                    </p>
                </div>

                {error && (
                    <div className="font-sans text-xs text-red-700 bg-red-50 border border-red-200/60 rounded-md p-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={register} className="space-y-4">
                    <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-gray mb-1.5 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@gmail.com"
                            required
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                            className="w-full bg-white border border-neutral-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-gray mb-1.5 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })
                            }
                            className="w-full bg-white border border-neutral-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-gray mb-1.5 ml-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={form.confirm_password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    confirm_password: e.target.value
                                })
                            }
                            className="w-full bg-white border border-neutral-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-deep disabled:bg-sage-primary/50 text-white font-mono text-xs uppercase tracking-wider py-4 rounded-md hover:bg-neutral-dark hover:shadow-md transition-all cursor-pointer font-medium mt-6 flex justify-center"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="mt-8 text-center font-sans text-xs text-neutral-gray">
                    Already have an account?{" "}
                    <Link to="/login" className="font-mono uppercase tracking-wide text-xs text-sage-deep hover:text-neutral-dark hover:underline ml-1">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;