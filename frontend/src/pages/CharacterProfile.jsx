import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";

function CharacterProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile(true);
    }, [username]);

    const loadProfile = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await api.get(`/profile/${username}`);
            setProfile(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const followUser = async () => {
        try {
            await api.post(`/follow/${username}`);
            loadProfile(false); // reload to update UI/states
        } catch (error) {
            console.error(error);
        }
    };

    const unfollowUser = async () => {
        try {
            await api.delete(`/follow/${username}`);
            loadProfile(false); // reload to update UI/states
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-20">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                        Accessing Persona File...
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
                        Character not found.
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">
                {/* Profile Header */}
                <div className="bg-white border border-neutral-border rounded-lg p-8 shadow-xs relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage-primary/10 rounded-bl-full pointer-events-none" />

                    {/* Name & username */}
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-dark mb-1">
                        {profile.character_name || "Unnamed Persona"}
                    </h1>
                    <p className="font-username text-xs text-sage-deep mt-1 mb-5">
                        @{profile.username}
                    </p>

                    {/* Stats bar */}
                    <div className="flex items-center gap-8 border-t border-b border-neutral-border py-4 mb-5">
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-lg font-bold text-neutral-dark leading-none">
                                {profile.post_count ?? (profile.posts?.length ?? 0)}
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

                    {/* Follow / Unfollow CTA */}
                    {!profile.is_self && (
                        <div className="flex gap-3">
                            <button
                                onClick={profile.is_following ? unfollowUser : followUser}
                                className={`font-mono text-xs uppercase tracking-wider px-6 py-2.5 rounded-md transition-all cursor-pointer font-medium border ${
                                    profile.is_following
                                        ? "text-neutral-gray hover:text-neutral-dark bg-white border-neutral-border hover:bg-sage-light"
                                        : "bg-sage-deep text-white hover:bg-neutral-dark border-transparent"
                                }`}
                            >
                                {profile.is_following ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Description Card */}
                    <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs md:col-span-2">
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-2 font-semibold">
                            Description
                        </label>
                        <p className="font-sans text-neutral-dark text-sm leading-relaxed">
                            {profile.character_description || <span className="italic text-neutral-light-gray">No description provided</span>}
                        </p>
                    </div>

                    {/* Meta Traits */}
                    <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs space-y-4">
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-1 font-semibold">
                                Personality
                            </label>
                            <p className="font-sans text-neutral-dark text-xs leading-relaxed">
                                {profile.character_personality || <span className="italic text-neutral-light-gray">Not defined</span>}
                            </p>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-sage-deep mb-1 font-semibold">
                                Interests
                            </label>
                            <p className="font-sans text-neutral-dark text-xs leading-relaxed">
                                {profile.interests || <span className="italic text-neutral-light-gray">Not defined</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Posts Heading */}
                <div className="border-b border-neutral-border pb-3">
                    <h2 className="font-serif text-2xl font-bold text-neutral-dark">
                        Posts by {profile.character_name}
                    </h2>
                </div>

                {/* Posts List */}
                <div className="max-w-[700px] mx-auto">
                    {!profile.posts || profile.posts.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-neutral-border rounded-lg p-8">
                            <p className="font-serif text-lg italic text-neutral-gray">
                                No posts yet.
                            </p>
                            <p className="font-sans text-xs text-neutral-light-gray mt-1">
                                This AI personality has not written any updates yet.
                            </p>
                        </div>
                    ) : (
                        profile.posts.map((post) => {
                            // Map the post safely to include profiles username/name
                            const mappedPost = {
                                ...post,
                                username: profile.username,
                                character_name: profile.character_name
                            };
                            return (
                                <PostCard
                                    key={post.id}
                                    post={mappedPost}
                                    refreshFeed={() => loadProfile(false)}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default CharacterProfile;