import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Pill,
  Plus,
  Calendar,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";


import api from "@/lib/axios";
import DoseReminder from "@/components/DoseReminder";
import { toast } from "sonner";

// ... existing imports

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [todayMeds, setTodayMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const stored = localStorage.getItem("pillmate-theme");
    setIsDark(stored === "dark");

    const userInfo = localStorage.getItem("pillmate-userInfo"); // Assuming 'pillmate-userInfo' or just 'userInfo' based on Auth.tsx
    // Let's check Auth.tsx again. It sets 'userInfo'.
    // Wait, Auth.tsx sets 'userInfo'. 
    const uInfo = localStorage.getItem("userInfo");
    if (uInfo) {
      try {
        const parsed = JSON.parse(uInfo);
        setUserName(parsed.name || "User");
      } catch (e) {
        console.error("Error parsing user info", e);
      }
    }

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("pillmate-userInfo"); // clearing both just in case
    navigate("/auth");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, medicinesRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/medicines')
      ]);

      setStatsData(analyticsRes.data);

      setStatsData(analyticsRes.data);

      const todayLogs = analyticsRes.data.todayLogs || [];

      const meds = medicinesRes.data.flatMap((med: any) => {
        // We expand each medicine time into a dashboard item
        return med.times.map((time: string) => {
          // Find if there is a log for this specific medicine and time (roughly)
          // Ideally we match exact scheduledAt, but for display we match medicineId and time string check
          // Or simpler: We look for a log that matches this medicine ID.

          // Filter logs for this medicine
          const medLogs = todayLogs.filter((log: any) =>
            log.medicine === med._id || log.medicine._id === med._id
          );

          // Find specific log for this time time slot
          // We need to parse the time string from log.scheduledAt to compare with 'time' (HH:MM)
          const logForThisTime = medLogs.find((log: any) => {
            const logDate = new Date(log.scheduledAt);
            const logTime = `${String(logDate.getHours()).padStart(2, '0')}:${String(logDate.getMinutes()).padStart(2, '0')}`;
            return logTime === time;
          });

          let status = 'Upcoming';
          let isTaken = false;

          const now = new Date();
          const [h, m] = time.split(':');
          const schedTime = new Date();
          schedTime.setHours(parseInt(h), parseInt(m), 0, 0);

          if (logForThisTime) {
            status = logForThisTime.status;
            isTaken = status === 'Taken';
          } else {
            // No log yet. Check if it's in the past
            if (schedTime < now) {
              // It's in the past but no log created (cron hasn't run or missed). 
              // Or maybe it's just due.
              status = 'Pending';
            }
          }

          return {
            id: med._id,
            uniqueId: `${med._id}-${time}`, // React key
            name: med.name,
            dosage: med.dosage,
            time: time,
            taken: isTaken,
            status: status, // Pending, Taken, Missed, Upcoming
            upcoming: schedTime > now && status !== 'Taken', // For UI styling
            logId: logForThisTime?._id
          };
        });
      }).sort((a: any, b: any) => {
        // Sort by time
        return a.time.localeCompare(b.time);
      });

      setTodayMeds(meds);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = async (medId: string) => {
    try {
      await api.post('/logs', {
        medicineId: medId,
        status: "Taken",
        takenAt: new Date()
      });
      toast.success("Marked as taken");
      fetchDashboardData(); // Refresh to update score
    } catch (error) {
      toast.error("Failed to mark as taken");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const stats = [
    { label: "Today's Progress", value: statsData?.todayStats?.taken + "/" + (statsData?.todayStats?.taken + statsData?.todayStats?.pending) || "0/0", percent: statsData?.adherenceScore || 0, icon: CheckCircle2, color: "text-success" },
    { label: "Adherence Score", value: (statsData?.adherenceScore || 0) + "%", percent: statsData?.adherenceScore || 0, icon: TrendingUp, color: "text-primary" },
    { label: "Active Medicines", value: statsData?.totalMedicines || 0, percent: 100, icon: Clock, color: "text-warning" },
    { label: "Missed Doses", value: statsData?.todayStats?.missed || 0, percent: 0, icon: AlertTriangle, color: "text-accent" },
  ];

  return (
    <>
      <DoseReminder />
      <Helmet>
        <title>Dashboard | PillMate</title>
        <meta name="description" content="View your medication schedule and track your adherence with PillMate dashboard." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <header className="glass-strong border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Pill<span className="text-gradient">Mate</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Link to="/medicines">
                <Button variant="hero" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </Link>
              <Link to="/medicines">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon" title="Settings">
                  <LogOut className="w-5 h-5 hidden" /> {/* Hidden hack for import if needed, but better to use icon directly */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground hover:text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Log Out">
                <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">{getGreeting()}, {userName}!</h1>
            <p className="text-muted-foreground">Here's your medication overview for today.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <Progress value={stat.percent} className="h-1.5" />
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Schedule
                  </h2>
                  <Link to="/schedule">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {todayMeds.map((med) => (
                    <motion.div
                      key={med.id}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${med.taken
                        ? "bg-success/10 border border-success/20"
                        : med.upcoming
                          ? "bg-warning/10 border border-warning/20"
                          : "bg-muted/50 border border-border"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${med.taken
                            ? "bg-success text-success-foreground"
                            : med.upcoming
                              ? "bg-warning text-warning-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {med.taken ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Pill className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{med.time}</span>
                        {!med.taken && (
                          <Button
                            variant={med.upcoming ? "accent" : "outline"}
                            size="sm"
                            onClick={() => handleMarkTaken(med.id)}
                          >
                            {med.upcoming ? "Take Now" : "Mark Taken"}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link to="/medicines">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Plus className="w-5 h-5 mr-3" />
                      Add New Medicine
                    </Button>
                  </Link>
                  <Link to="/schedule">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Calendar className="w-5 h-5 mr-3" />
                      View Full Schedule
                    </Button>
                  </Link>
                  <Link to="/insights">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      AI Health Insights
                    </Button>
                  </Link>
                </div>

                {/* Reminder Card */}
                <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground">Refill Reminder</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Vitamin D3 is running low. Only 5 days supply remaining.
                      </p>
                      <Button variant="accent" size="sm" className="mt-3">
                        Order Refill
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
