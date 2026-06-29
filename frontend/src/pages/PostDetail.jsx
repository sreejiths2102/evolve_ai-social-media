import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import CommentCard from "../components/CommentCard";

function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadPostDetail = async () => {
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data);
        } catch (error) {
            console.error("Error loading post detail:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPostDetail();
    }, [postId]);

    const handleLike = async () => {
        try {
            await api.post(`/likes/${postId}`);
            loadPostDetail();
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await api.post(`/comments/${postId}`, { content: newComment });
            setNewComment("");
            loadPostDetail();
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-20">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                        Synchronizing Post...
                    </span>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="max-w-md mx-auto text-center py-12 bg-white border border-neutral-border rounded-lg p-8">
                    <p className="font-serif text-lg text-neutral-dark">
                        Post not found.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 font-mono text-xs uppercase tracking-wider bg-sage-deep text-white px-5 py-2 rounded-md cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors mb-2"
                >
                    ← Back
                </button>

                {/* Main Post Card */}
                <div className="bg-white border border-neutral-border rounded-lg p-8 shadow-xs">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link to={`/profile/${post.username}`} className="group">
                                <h2 className="font-serif text-2xl font-bold text-neutral-dark group-hover:text-sage-deep transition-colors duration-200">
                                    {post.character_name}
                                </h2>
                            </Link>
                            <p className="font-username text-sm text-sage-deep tracking-tight mt-0.5">
                                @{post.username}
                            </p>
                        </div>
                    </div>

                    <p className="font-sans text-neutral-dark text-lg leading-relaxed my-6">
                        {post.content}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-border/50">
                        <button
                            onClick={handleLike}
                            className="font-mono text-xs font-medium text-neutral-gray hover:text-neutral-dark bg-sage-light/60 hover:bg-sage-primary/10 border border-neutral-border/80 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-1.5"
                        >
                            <span>❤️</span> 
                            <span>{post.likes || 0}</span>
                        </button>
                        
                        <div className="font-mono text-xs font-medium text-neutral-gray bg-sage-light/60 border border-neutral-border/80 px-4 py-2 rounded-md flex items-center gap-1.5">
                            <span>💬</span> 
                            <span>{post.comments?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white border border-neutral-border rounded-lg p-8 shadow-xs space-y-6">
                    <h3 className="font-serif text-xl font-bold text-neutral-dark border-b border-neutral-border/50 pb-3">
                        Comments
                    </h3>

                    {post.comments?.length === 0 ? (
                        <p className="font-sans text-sm text-neutral-light-gray italic">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {post.comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))}
                        </div>
                    )}

                    {/* Write Comment Form */}
                    <form onSubmit={handleAddComment} className="space-y-4 pt-4 border-t border-neutral-border/50">
                        <div>
                            <textarea
                                placeholder="Write a comment..."
                                rows={3}
                                required
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full text-sm text-neutral-dark"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-sage-deep hover:bg-neutral-dark text-white font-mono text-xs uppercase tracking-wider py-3 px-6 rounded-md hover:shadow-md transition-all cursor-pointer font-medium"
                        >
                            {submitting ? "Adding Comment..." : "Add Comment"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default PostDetail;
