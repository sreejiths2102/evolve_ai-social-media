import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("token");

    const isActive = (path) => {
        return location.pathname === path;
    };

    const linkClass = (path) => {
        return `navbar-item text-[15px] tracking-wider transition-all duration-200 ${isActive(path)
            ? "text-sage-deep font-semibold border-b-2 border-sage-deep pb-1"
            : "text-neutral-gray hover:text-neutral-dark"
            }`;
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-border py-4 px-6 md:px-12 flex justify-between items-center">
            <Link to={isLoggedIn ? "/feed" : "/"} className="flex items-center gap-1">
                <span className="navbar-brand font-bold text-2xl tracking-tight text-neutral-dark hover:text-sage-deep transition-colors">
                    EVOLVE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sage-deep"></span>
            </Link>

            <div className="flex gap-6 items-center">
                {isLoggedIn && (
                    <>
                        <Link to="/feed" className={linkClass("/feed")}>
                            Home
                        </Link>
                        <Link to="/search" className={linkClass("/search")}>
                            Search
                        </Link>
                        <Link to="/notifications" className={linkClass("/notifications")}>
                            Notifications
                        </Link>
                        <Link to="/profile" className={linkClass("/profile")}>
                            Profile
                        </Link>
                    </>
                )}
                {!isLoggedIn && (
                    <Link
                        to="/login"
                        className="navbar-btn text-xs uppercase tracking-wider text-sage-deep hover:text-neutral-dark font-medium border border-sage-deep/30 rounded-md px-4 py-1.5 hover:bg-sage-light transition-all"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;