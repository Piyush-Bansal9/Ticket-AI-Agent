import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, secure }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (secure) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      // unprotected route
      if (token && (window.location.pathname === "/login" || window.location.pathname === "/signup")) {
        // Optional: prevent redirect loop when already logged in and explicitly going to login/signup
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, secure]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}

export default CheckAuth;
