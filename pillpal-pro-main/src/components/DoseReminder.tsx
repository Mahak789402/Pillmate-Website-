

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Medicine {
    _id: string;
    name: string;
    dosage: string;
    times: string[]; // "HH:MM" format
}

const DoseReminder = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [lastCheck, setLastCheck] = useState<string>("");

    // Alert State
    const [activeAlert, setActiveAlert] = useState<Medicine | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchMedicines();
        requestNotificationPermission();

        // Initialize Audio
        audioRef.current = new Audio('/notification.mp3'); // Ensure this file exists in public/

        // Check every minute
        const interval = setInterval(checkDoses, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get("/medicines");
            setMedicines(data);
        } catch (error) {
            console.error("Failed to fetch medicines for reminders", error);
        }
    };

    const requestNotificationPermission = async () => {
        if ("Notification" in window && Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    };

    const checkDoses = () => {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hour}:${minute}`;

        if (currentTime === lastCheck) return;
        setLastCheck(currentTime);

        medicines.forEach((med) => {
            if (med.times.some(t => t === currentTime)) {
                triggerAlert(med);
            }
        });
    };

    const triggerAlert = (med: Medicine) => {
        setActiveAlert(med);

        // Play Sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e));
        }

        // Browser Notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Time to take ${med.name}`, {
                body: `Dosage: ${med.dosage}`,
                icon: "/vite.svg",
            });
        }
    };

    const handleAction = async (status: 'Taken' | 'Missed') => {
        if (!activeAlert) return;

        try {
            await api.post('/logs', {
                medicineId: activeAlert._id,
                status: status,
                takenAt: new Date()
            });

            const msg = status === 'Taken' ? "Marked as Taken" : "Marked as Missed";
            toast.success(msg);

            // Close Alert
            setActiveAlert(null);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

        } catch (error) {
            console.error("Failed to log dose", error);
            toast.error("Failed to update status");
        }
    };

    return (
        <>
            <AnimatePresence>
                {activeAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-primary/10 p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <Bell className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">Time to take {activeAlert.name}</h2>
                                <p className="text-muted-foreground mt-2">Dosage: {activeAlert.dosage}</p>
                            </div>

                            <div className="p-6 grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-14 text-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleAction('Missed')}
                                >
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Missed
                                </Button>
                                <Button
                                    className="h-14 text-lg bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleAction('Taken')}
                                >
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Taken
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="h-14 text-lg col-span-2"
                                    onClick={() => {
                                        toast.info("Snoozed for 5 minutes");
                                        setActiveAlert(null);
                                        if (audioRef.current) {
                                            audioRef.current.pause();
                                            audioRef.current.currentTime = 0;
                                        }
                                        setTimeout(() => triggerAlert(activeAlert!), 5 * 60 * 1000);
                                    }}
                                >
                                    💤 Snooze 5m
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Test Button - Removed for Production or keep as hidden dev feature */}
            {/* <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => triggerAlert({ _id: 'test', name: 'Test Medicine', dosage: '1 pill', times: ['00:00'] })}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-xs hover:bg-primary/90 transition-colors"
                >
                    🔔 Test Alert
                </button>
            </div> */}
        </>
    );
};

export default DoseReminder;


