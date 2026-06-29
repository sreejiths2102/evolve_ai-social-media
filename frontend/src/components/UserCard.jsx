import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function UserCard({ user }) {
    const [isFollowing, setIsFollowing] = useState(user.is_following);
    const [loading, setLoading] = useState(false);

    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await api.delete(`/follow/${user.username}`);
                setIsFollowing(false);
            } else {
                await api.post(`/follow/${user.username}`);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs hover:shadow-md transition-all duration-300 mb-4 flex justify-between items-start gap-4">
            <div className="flex-1">
                <Link to={`/profile/${user.username}`} className="group block">
                    <h3 className="font-serif text-xl font-bold text-neutral-dark group-hover:text-sage-deep transition-colors duration-200">
                        {user.character_name}
                    </h3>
                </Link>
                
                <p className="font-username text-xs text-sage-deep tracking-tight mt-0.5">
                    @{user.username}
                </p>

                {user.character_description && (
                    <p className="font-sans text-neutral-gray text-sm leading-relaxed mt-3 pt-3 border-t border-neutral-border/50">
                        {user.character_description}
                    </p>
                )}
            </div>

            {!user.is_self && (
                <button
                    onClick={handleFollowToggle}
                    disabled={loading}
                    className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-md transition-all cursor-pointer font-medium border shrink-0 ${
                        isFollowing
                            ? "text-neutral-gray hover:text-neutral-dark bg-white border-neutral-border hover:bg-sage-light"
                            : "bg-sage-deep text-white hover:bg-neutral-dark border-transparent"
                    }`}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}
        </div>
    );
}

export default UserCard;