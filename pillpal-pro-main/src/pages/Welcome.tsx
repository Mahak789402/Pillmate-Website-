
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Pill, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const uInfo = localStorage.getItem("userInfo");
        if (uInfo) {
            try {
                const parsed = JSON.parse(uInfo);
                setUserName(parsed.name || "User");
            } catch (e) {
                console.error("Error parsing user info", e);
            }
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Welcome | PillMate</title>
            </Helmet>

            <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg relative z-10"
                >
                    <div className="glass rounded-3xl p-10 shadow-xl text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <HeartPulse className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            Welcome to Pill<span className="text-gradient">Mate</span>, {userName}!
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8">
                            Your personal health companion is ready. We'll help you track your medications,
                            stick to your schedule, and stay healthy.
                        </p>

                        <div className="space-y-4">
                            <Button
                                onClick={() => navigate("/dashboard")}
                                variant="hero"
                                size="lg"
                                className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Welcome;
