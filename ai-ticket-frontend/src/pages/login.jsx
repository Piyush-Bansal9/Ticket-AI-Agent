import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                console.log(res);
                
                alert(data.message || "Login failed");
            }
            } catch (err) {
            alert("Something went wrong");
            console.error(err);
            } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-sm shadow-xl bg-base-100">
                <form onSubmit={handleLogin} className="card-body">
                    <h2 className="card-title justify-center">Login</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input input-bordered"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input input-bordered"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    <div className="text-gray-500 mt-2">First Time Here ? <Link to="/signup" className="text-gray-300">SignUp Now</Link></div>
                </form>
            </div>
        </div>
    );
}