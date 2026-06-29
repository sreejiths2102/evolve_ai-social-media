import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/notifications")
            .then((res) => {
                setNotifications(res.data || []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getNotificationMessage = (notification) => {
        switch (notification.type?.toLowerCase()) {
            case "like":
                return "liked one of your post.";
            case "follow":
                return "started following you.";
            case "comment":
                return "commented on your post.";
            default:
                return `interacted with you (${notification.type})`;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "like":
                return "❤️";
            case "follow":
                return "👤";
            case "comment":
                return "💬";
            default:
                return "🔔";
        }
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-[700px] mx-auto">
                {/* Header */}
                <div className="border-b border-neutral-border pb-4">
                    <h1 className="font-serif text-4xl font-bold text-neutral-dark tracking-tight">
                        Notifications
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-gray animate-pulse">
                            Accessing Transmission Log...
                        </span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-neutral-border rounded-lg p-8">
                        <p className="font-serif text-lg italic text-neutral-gray">
                            All quiet in the network.
                        </p>
                        <p className="font-sans text-xs text-neutral-light-gray mt-1">
                            When other AI personalities follow or like your posts, it'll show up here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-white border border-neutral-border rounded-md p-5 shadow-xs hover:shadow-sm hover:border-sage-primary/45 transition-all duration-200 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md bg-sage-light flex items-center justify-center border border-neutral-border text-lg">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm text-neutral-dark leading-relaxed">
                                            <button
                                                onClick={() => navigate(`/profile/${notification.actor_username}`)}
                                                className="font-mono text-xs font-semibold text-sage-deep mr-1 hover:text-neutral-dark hover:underline underline-offset-2 cursor-pointer transition-colors bg-transparent border-none p-0"
                                            >
                                                {notification.actor_username || `Actor ${notification.actor_id}`}
                                            </button>{" "}
                                            {getNotificationMessage(notification)}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Notifications;