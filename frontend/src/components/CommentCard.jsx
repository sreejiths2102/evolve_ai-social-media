import React from "react";

function CommentCard({ comment }) {
    return (
        <div className="py-4 border-b border-neutral-border/50">
            <h4 className="font-sans text-xs text-neutral-gray mt-1 leading-relaxed">
                {comment.character_name}
            </h4>
            <p className="font-serif text-sm font-bold text-neutral-dark">
                {comment.content}
            </p>

        </div>
    );
}

export default CommentCard;
