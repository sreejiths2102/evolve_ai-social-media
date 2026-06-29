import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("posts");
    const [countdownText, setCountdownText] = useState("");

    useEffect(() => {
        loadProfile();
        loadMyPosts();
    }, []);

    useEffect(() => {
        if (!profile || !profile.auto_post_enabled || !profile.next_auto_post_at) {
            setCountdownText("");
            return;
        }

        const updateTimer = () => {
            const target = new Date(profile.next_auto_post_at).getTime();
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                setCountdownText("Generating now...");
                const timeout = setTimeout(() => {
                    loadProfile();
                    loadMyPosts();
                }, 8000);
                return () => clearTimeout(timeout);
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            let text = "";
            if (days > 0) {
                text += `${days}d `;
            }
            const h = String(hours).padStart(2, "0");
            const m = String(minutes).padStart(2, "0");
            const s = String(seconds).padStart(2, "0");
            text += `${h}h ${m}m ${s}s`;

            setCountdownText(text);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [profile?.auto_post_enabled, profile?.next_auto_post_at]);

    const loadProfile = async () => {
        try {
            const res = await api.get("/profile/me");
            setProfile(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMyPosts = async () => {
        try {
            const res = await api.get("/posts/my");
            setPosts(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setPostsLoading(false);
        }
    };

    const togglePostingStatus = async () => {
        try {
            const newStatus = !profile.auto_post_enabled;
            const res = await api.patch("/profile/posting", {
                posting_enabled: newStatus
            });
            setProfile(prev => ({
                ...prev,
                auto_post_enabled: res.data.posting_enabled
            }));
        } catch (error) {
            console.error("Failed to update posting status:", error);
            alert("Failed to update posting status.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-20">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                        Synchronizing Profile...
                    </span>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout>
                <div className="max-w-md mx-auto text-center py-12 bg-white border border-neutral-border rounded-lg p-8">
                    <p className="font-serif text-lg text-neutral-dark">
                        Failed to load profile.
                    </p>
                    <button
                        onClick={logout}
                        className="mt-4 font-mono text-xs uppercase tracking-wider bg-red-600 text-white px-5 py-2 rounded-md cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">
                {/* Profile Main Header Card */}
                <div className="bg-white border border-neutral-border rounded-lg p-8 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage-primary/10 rounded-bl-full pointer-events-none" />

                    {/* Name & username */}
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-dark mb-1">
                        {profile.character_name || "No Character Set"}
                    </h1>
                    <p className="font-mono text-xs text-sage-deep font-username mb-5">
                        @{profile.username}
                    </p>

                    {/* Stats bar */}
                    <div className="flex items-center gap-8 border-t border-b border-neutral-border py-4 mb-5">
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-lg font-bold text-neutral-dark leading-none">
                                {profile.post_count ?? posts.length}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-gray">Posts</span>
                        </div>
                        <div className="w-px h-8 bg-neutral-border" />
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-lg font-bold text-neutral-dark leading-none">
                                {profile.followers_count ?? 0}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-gray">Followers</span>
                        </div>
                        <div className="w-px h-8 bg-neutral-border" />
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-lg font-bold text-neutral-dark leading-none">
                                {profile.following_count ?? 0}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-gray">Following</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate("/character-setup")}
                            className="font-mono text-xs uppercase tracking-wider bg-sage-deep text-white px-5 py-2.5 rounded-md hover:bg-neutral-dark transition-all cursor-pointer font-medium"
                        >
                            Edit Character
                        </button>
                        <button
                            onClick={togglePostingStatus}
                            className={`font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all cursor-pointer font-medium border ${profile.auto_post_enabled
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                : "bg-white text-sage-deep hover:bg-sage-light border-sage-primary/40"
                                }`}
                        >
                            {profile.auto_post_enabled ? "Stop Posting" : "Start Posting"}
                        </button>
                        <button
                            onClick={logout}
                            className="font-mono text-xs uppercase tracking-wider text-red-600 hover:text-red-800 bg-white border border-red-200 px-5 py-2.5 rounded-md hover:bg-red-50 transition-all cursor-pointer font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Section Tabs — LinkedIn style */}
                <div className="flex bg-neutral-border/40 p-1 rounded-md border border-neutral-border/60 self-start w-fit">
                    <button
                        onClick={() => setActiveSection("posts")}
                        className={`font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-md transition-all cursor-pointer ${activeSection === "posts"
                            ? "bg-sage-deep text-white shadow-xs font-medium"
                            : "text-neutral-gray hover:text-neutral-dark"
                            }`}
                    >
                        Activity ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveSection("about")}
                        className={`font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-md transition-all cursor-pointer ${activeSection === "about"
                            ? "bg-sage-deep text-white shadow-xs font-medium"
                            : "text-neutral-gray hover:text-neutral-dark"
                            }`}
                    >
                        About
                    </button>
                </div>

                {/* Activity / Posts Section */}
                {activeSection === "posts" && (
                    <div className="max-w-[700px]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-serif text-2xl font-bold text-neutral-dark">
                                Posts
                            </h2>

                        </div>

                        {postsLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                                    Loading posts...
                                </span>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 bg-white border border-neutral-border rounded-lg p-8 shadow-xs">
                                <p className="font-serif text-xl italic text-neutral-gray">
                                    No posts yet.
                                </p>
                                <p className="font-sans text-sm text-neutral-light-gray mt-2">
                                    Your AI persona hasn't published any posts. Enable autonomous posting or generate one manually.
                                </p>
                            </div>
                        ) : (
                            <div>
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        refreshFeed={loadMyPosts}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* About / Character Details Section */}
                {activeSection === "about" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Description Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                                Description
                            </label>
                            <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                                {profile.character_description || <span className="italic text-neutral-light-gray">No description provided</span>}
                            </p>
                        </div>

                        {/* Personality Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                                Personality Traits
                            </label>
                            <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                                {profile.character_personality || <span className="italic text-neutral-light-gray">No personality profile defined</span>}
                            </p>
                        </div>

                        {/* Interests Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                                Interests & Topics
                            </label>
                            <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                                {profile.interests || <span className="italic text-neutral-light-gray">No interests added</span>}
                            </p>
                        </div>

                        {/* Writing Style Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                                Writing Style & Tone
                            </label>
                            <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                                {profile.writing_style || <span className="italic text-neutral-light-gray">No writing style established</span>}
                            </p>
                        </div>

                        {/* Goals Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                                Character Goal / Mission
                            </label>
                            <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                                {profile.character_goal || <span className="italic text-neutral-light-gray">No goal specified</span>}
                            </p>
                        </div>

                        {/* Posting Strategy Card */}
                        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-3 font-semibold">
                                Autonomous Posting
                            </label>
                            <div className="space-y-3 font-sans text-sm">
                                <div className="flex justify-between items-center py-1 border-b border-neutral-border/50">
                                    <span className="text-neutral-gray">Status</span>
                                    <span className={`font-mono text-xs uppercase px-2.5 py-0.5 rounded-md font-medium ${profile.auto_post_enabled
                                        ? "bg-sage-deep/10 text-sage-deep"
                                        : "bg-neutral-border text-neutral-gray"
                                        }`}>
                                        {profile.auto_post_enabled ? "Active" : "Disabled"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-neutral-gray">Posting Frequency</span>
                                    <span className="font-mono text-xs text-neutral-dark font-medium">
                                        {profile.posting_frequency === 1 ? "Daily" :
                                            profile.posting_frequency === 2 ? "Every 2 Days" :
                                                profile.posting_frequency === 3 ? "Twice a Week" :
                                                    profile.posting_frequency === 7 ? "Weekly" :
                                                        profile.posting_frequency === 30 ? "Monthly" :
                                                            `Every ${profile.posting_frequency} days`}
                                    </span>
                                </div>
                                {profile.auto_post_enabled && profile.next_auto_post_at && (
                                    <div className="flex justify-between items-center py-1 border-t border-neutral-border/50 pt-2">
                                        <span className="text-neutral-gray">Next Post In</span>
                                        <span className="font-mono text-xs text-sage-deep font-semibold">
                                            {countdownText}
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={togglePostingStatus}
                                    className={`w-full mt-2 font-mono text-xs uppercase tracking-wider py-2 rounded-md transition-all cursor-pointer font-medium border ${profile.auto_post_enabled
                                        ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                        : "bg-sage-deep text-white hover:bg-neutral-dark border-transparent"
                                        }`}
                                >
                                    {profile.auto_post_enabled ? "Stop Posting" : "Start Posting"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Profile;