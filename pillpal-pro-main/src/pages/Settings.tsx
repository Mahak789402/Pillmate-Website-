
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    Settings as SettingsIcon,
    Sun,
    Moon,
    ChevronLeft,
    User,
    Bell,
    Heart,
    Save,
    LogOut,
    Calendar,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        caregiverName: "",
        caregiverEmail: "",
        caregiverPhone: "",
        darkMode: false,
        notifications: true,
    });

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("pillmate-theme");
        setIsDark(stored === "dark");
        fetchProfile();

        // Check URL for status
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        if (status === 'connected') {
            toast.success("Successfully connected to Google Calendar!");
            // Clean URL
            window.history.replaceState({}, '', '/settings');
            setIsConnected(true);
        } else if (status === 'failed') {
            toast.error("Failed to connect to Google Calendar");
            window.history.replaceState({}, '', '/settings');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
        setFormData(prev => ({ ...prev, darkMode: isDark }));
    }, [isDark]);

    const handleConnectCalendar = async () => {
        try {
            const { data } = await api.get('/calendar/auth');
            window.location.href = data.url;
        } catch (error: any) {
            console.error("Google Auth Error:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            toast.error("Failed to initiate Google connection");
        }
    };


    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/profile');
            setFormData({
                name: data.name,
                email: data.email,
                caregiverName: data.caregiver?.name || "",
                caregiverEmail: data.caregiver?.email || "",
                caregiverPhone: data.caregiver?.phone || "",
                darkMode: data.preferences?.darkMode || false,
                caregiverPhone: data.caregiver?.phone || "",
                darkMode: data.preferences?.darkMode || false,
                notifications: data.preferences?.notifications ?? true,
            });
            setIsDark(data.preferences?.darkMode || false);
            if (data.googleCalendarToken) {
                setIsConnected(true);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error("Failed to load settings");
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email,
                preferences: {
                    darkMode: formData.darkMode,
                    notifications: formData.notifications
                },
                caregiver: {
                    name: formData.caregiverName,
                    email: formData.caregiverEmail,
                    phone: formData.caregiverPhone
                }
            });

            // Update local user info
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('pillmate-userInfo', JSON.stringify(data));

            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("pillmate-userInfo");
        navigate("/auth");
    };

    return (
        <>
            <Helmet>
                <title>Settings | PillMate</title>
            </Helmet>

            <div className="min-h-screen bg-background pb-20">
                {/* Header */}
                <header className="glass-strong border-b border-border sticky top-0 z-50">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <h1 className="text-xl font-bold">Settings</h1>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Profile Section */}
                        <section className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">My Profile</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Caregiver Section */}
                        <section className="glass rounded-2xl p-6 border-l-4 border-l-accent">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Caregiver</h2>
                                    <p className="text-sm text-muted-foreground">Manage who receives alerts if you miss a dose</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="c-name">Caregiver Name</Label>
                                    <Input
                                        id="c-name"
                                        placeholder="e.g. Dr. Smith or Mom"
                                        value={formData.caregiverName}
                                        onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-email">Caregiver Email</Label>
                                        <Input
                                            id="c-email"
                                            type="email"
                                            placeholder="caregiver@example.com"
                                            value={formData.caregiverEmail}
                                            onChange={(e) => setFormData({ ...formData, caregiverEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-phone">Caregiver Phone</Label>
                                        <Input
                                            id="c-phone"
                                            placeholder="+1 234 567 890"
                                            value={formData.caregiverPhone}
                                            onChange={(e) => setFormData({ ...formData, caregiverPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Google Calendar Integration */}
                        <section className="glass rounded-2xl p-6 border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Google Calendar</h2>
                                    <p className="text-sm text-muted-foreground">Sync your medication schedule automatically</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Connection Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {isConnected
                                            ? "Your schedule is syncing with Google Calendar"
                                            : "Connect to sync your doses"}
                                    </p>
                                </div>
                                {isConnected ? (
                                    <Button variant="outline" className="border-green-500 text-green-500 hover:text-green-600 hover:bg-green-50">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Connected
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={handleConnectCalendar}>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Connect Google Calendar
                                    </Button>
                                )}
                            </div>
                        </section>

                        {/* App Preferences */}
                        <section className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                                    <SettingsIcon className="w-5 h-5 text-foreground" />
                                </div>
                                <h2 className="text-xl font-semibold">App Preferences</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Moon className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Dark Mode</p>
                                            <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={isDark}
                                        onCheckedChange={setIsDark}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive alerts for medications</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={formData.notifications}
                                        onCheckedChange={(c) => setFormData({ ...formData, notifications: c })}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="sticky bottom-4">
                            <Button
                                variant="hero"
                                size="lg"
                                className="w-full shadow-xl"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="pt-8 text-center">
                            <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Log Out
                            </Button>
                        </div>

                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default Settings;
