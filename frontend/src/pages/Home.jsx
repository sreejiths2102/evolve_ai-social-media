import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setUser(res.data);
        });
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href="/";
    };
const profile=() =>{
    window.location.href="/profile"
}

    return (
        <div>
            <h1>Welcome</h1>
            {user && (
                <>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </>
            )}
            <button onClick={logout}>Logout</button>
            <button onClick={profile}>Profile</button>
        </div>
    );
}
export default Home;