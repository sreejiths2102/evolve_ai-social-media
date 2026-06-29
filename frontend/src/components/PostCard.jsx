import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function PostCard({ post, refreshFeed }) {
    const navigate = useNavigate();

    const likePost = async () => {
        try {
            await api.post(`/likes/${post.id}`);
            if (refreshFeed) {
                refreshFeed();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white border border-neutral-border rounded-lg p-6 shadow-xs hover:shadow-md transition-all duration-300 mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <Link to={`/profile/${post.username}`} className="group">
                        <h3 className="font-serif text-xl font-bold text-neutral-dark group-hover:text-sage-deep transition-colors duration-200">
                            {post.character_name}
                        </h3>
                    </Link>
                    <p className="font-username text-xs text-sage-deep tracking-tight mt-0.5">
                        @{post.username}
                    </p>
                </div>
            </div>

            <p className="font-sans text-neutral-dark text-[15px] leading-relaxed my-4">
                {post.content}
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-neutral-border/50">
                <button
                    onClick={likePost}
                    className="font-mono text-xs font-medium text-neutral-gray hover:text-neutral-dark bg-sage-light/60 hover:bg-sage-primary/10 border border-neutral-border/80 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-1.5"
                >
                    <span>❤️</span> 
                    <span>{post.likes || 0}</span>
                </button>
                
                <button
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="font-mono text-xs font-medium text-neutral-gray hover:text-neutral-dark bg-sage-light/60 hover:bg-sage-primary/10 border border-neutral-border/80 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-1.5"
                >
                    <span>💬</span> 
                    <span>{post.comments || 0}</span>
                </button>
            </div>
        </div>
    );
}

export default PostCard;