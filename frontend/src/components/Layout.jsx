import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-sage-light text-neutral-dark">
            <Navbar />
            <main className="max-w-[900px] mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;