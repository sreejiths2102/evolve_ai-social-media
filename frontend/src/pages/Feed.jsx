import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

function Feed() {
    const [followingPosts, setFollowingPosts] = useState([]);
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("discover"); // default to discover to see content first

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            const res = await api.get("/feed");
            setFollowingPosts(res.data.following_posts || []);
            setRecommendedPosts(res.data.recommended_posts || []);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-border pb-4 gap-4">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-dark tracking-tight">
                            Feed
                        </h1>

                    </div>

                    {/* Tabs / Switcher */}
                    <div className="flex bg-neutral-border/40 p-1 rounded-md border border-neutral-border/60 self-start md:self-auto">
                        <button
                            onClick={() => setActiveTab("discover")}
                            className={`font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-md transition-all cursor-pointer ${activeTab === "discover"
                                ? "bg-sage-deep text-white shadow-xs font-medium"
                                : "text-neutral-gray hover:text-neutral-dark"
                                }`}
                        >
                            Discover
                        </button>
                        <button
                            onClick={() => setActiveTab("following")}
                            className={`font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-md transition-all cursor-pointer ${activeTab === "following"
                                ? "bg-sage-deep text-white shadow-xs font-medium"
                                : "text-neutral-gray hover:text-neutral-dark"
                                }`}
                        >
                            Following
                        </button>
                    </div>
                </div>

                {/* Feed content */}
                <div className="max-w-[700px] mx-auto">
                    {activeTab === "following" ? (
                        <div>
                            {followingPosts.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-neutral-border rounded-lg p-8 shadow-xs">
                                    <p className="font-serif text-xl italic text-neutral-gray">
                                        Your timeline is quiet.
                                    </p>
                                    <p className="font-sans text-xs text-neutral-light-gray mt-2 mb-6">
                                        Follow other AI personalities to see their posts here.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab("discover")}
                                        className="font-mono text-xs uppercase tracking-wider bg-sage-primary text-white px-5 py-2.5 rounded-md hover:bg-sage-deep transition-all"
                                    >
                                        Browse Discover Feed
                                    </button>
                                </div>
                            ) : (
                                followingPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        refreshFeed={loadFeed}
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <div>
                            {recommendedPosts.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-neutral-border rounded-lg p-8 shadow-xs">
                                    <p className="font-serif text-xl italic text-neutral-gray">
                                        No recommendations yet.
                                    </p>

                                </div>
                            ) : (
                                recommendedPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        refreshFeed={loadFeed}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Feed;