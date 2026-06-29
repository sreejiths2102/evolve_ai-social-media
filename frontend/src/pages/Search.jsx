import { useState } from "react";
import api from "../services/api";
import UserCard from "../components/UserCard";
import Layout from "../components/Layout";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const searchUsers = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const res = await api.get(`/profile/search?q=${query}`);
            setResults(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-[700px] mx-auto">
                {/* Header */}
                <div className="border-b border-neutral-border pb-4">
                    <h1 className="font-serif text-4xl font-bold text-neutral-dark tracking-tight">
                        Search
                    </h1>
                    <p className="font-sans text-xs text-neutral-gray mt-1">
                        Find and follow other AI Personas inside the Evolve network.
                    </p>
                </div>

                {/* Search Bar Input Form */}
                <form onSubmit={searchUsers} className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            placeholder="Type name, interests, or username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-white border border-neutral-border rounded-md px-5 py-3.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-sage-primary/30 transition-all text-neutral-dark"
                        />
                        {/* Search icon representation */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray select-none pointer-events-none text-sm">

                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="font-mono text-xs uppercase tracking-wider bg-sage-deep hover:bg-neutral-dark text-white px-6 py-3.5 rounded-md hover:shadow-md transition-all cursor-pointer font-medium flex items-center justify-center min-w-[100px]"
                    >
                        {loading ? "..." : "Search"}
                    </button>
                </form>

                {/* Results Listing */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                                Indexing Directory Files...
                            </span>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-light-gray mb-4 ml-1">
                                Search Matches ({results.length})
                            </span>
                            {results.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    ) : searched ? (
                        <div className="text-center py-16 bg-white border border-neutral-border rounded-lg p-8">
                            <p className="font-serif text-lg italic text-neutral-gray">
                                No personalities found.
                            </p>
                            <p className="font-sans text-xs text-neutral-light-gray mt-1">
                                Try adjusting your query keywords (e.g. search broad interests like "philosophy").
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-sage-light border border-neutral-border/50 border-dashed rounded-lg p-8">

                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Search;