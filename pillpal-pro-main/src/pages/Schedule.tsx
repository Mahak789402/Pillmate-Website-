import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Pill,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  times: string[];
  user: string;
}

interface ScheduleItem {
  time: string;
  meds: {
    id: string;
    name: string;
    dosage: string;
    taken: boolean;
  }[];
}

const Schedule = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pillmate-theme");
    setIsDark(stored === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (selectedDate) {
      fetchSchedule(selectedDate);
    }
  }, [selectedDate]);

  const fetchSchedule = async (date: Date) => {
    setLoading(true);
    try {
      // Fetch medicines
      const { data: meds } = await api.get('/medicines');

      // Fetch logs for this date (Not fully implemented in backend yet, so currently client-side filtering logic for "taken" status would go here if we had full log history)
      // For now, we will just assume "taken" is false unless we check a specific "today" log endpoint.
      // Let's improve this by fetching daily logs if available or just using medicines.

      // Simplified Logic: Map medicines to their times.
      // In a production app, we would query the backend for a "daily view" that joins Medicines + DoseLogs.
      // Here we do client-side transformation.

      const itemsMap: Record<string, any[]> = {};

      meds.forEach((med: Medicine) => {
        med.times.forEach(time => {
          if (!itemsMap[time]) {
            itemsMap[time] = [];
          }
          itemsMap[time].push({
            id: med._id,
            name: med.name,
            dosage: med.dosage,
            taken: false // Default to false until we integrate Logs
          });
        });
      });

      // Convert map to sorted array
      const sortedItems = Object.keys(itemsMap).sort().map(time => ({
        time,
        meds: itemsMap[time]
      }));

      setScheduleItems(sortedItems);

    } catch (error) {
      console.error("Failed to fetch schedule", error);
      toast.error("Failed to load schedule");
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
      // Ideally re-fetch or update local state
      if (selectedDate) fetchSchedule(selectedDate);
    } catch (error) {
      toast.error("Failed to mark as taken");
    }
  };

  return (
    <>
      <Helmet>
        <title>Schedule | PillMate</title>
        <meta name="description" content="View and manage your medication schedule with PillMate calendar view." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">
                  Pill<span className="text-gradient">Mate</span>
                </span>
              </Link>
              <Link to="/insights">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">Medication Schedule</h1>
            <p className="text-muted-foreground">View and manage your daily medication times</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass rounded-2xl p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </div>
            </motion.div>

            {/* Daily Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading schedule...</div>
                ) : scheduleItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No medicines scheduled for today.</div>
                ) : (
                  <div className="space-y-4">
                    {scheduleItems.map((slot, index) => (
                      <motion.div
                        key={slot.time}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex gap-4"
                      >
                        {/* Time Column */}
                        <div className="w-20 shrink-0 text-right">
                          <span className="text-sm font-medium text-muted-foreground">{slot.time}</span>
                        </div>

                        {/* Timeline */}
                        <div className="relative flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${slot.meds.every(m => m.taken)
                            ? "bg-success"
                            : slot.meds.some(m => m.taken)
                              ? "bg-warning"
                              : "bg-muted"
                            }`} />
                          {index < scheduleItems.length - 1 && (
                            <div className="w-0.5 h-full absolute top-3 bg-border" />
                          )}
                        </div>

                        {/* Meds */}
                        <div className="flex-1 pb-6">
                          <div className="space-y-2">
                            {slot.meds.map((med, medIndex) => (
                              <div
                                key={medIndex}
                                className={`flex items-center justify-between p-3 rounded-xl ${med.taken
                                  ? "bg-success/10 border border-success/20"
                                  : "bg-muted/50 border border-border"
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  {med.taken ? (
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                  )}
                                  <div>
                                    <span className="font-medium text-foreground">{med.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">{med.dosage}</span>
                                  </div>
                                </div>
                                {!med.taken && (
                                  <Button variant="success" size="sm" onClick={() => handleMarkTaken(med.id)}>
                                    Take
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Schedule;
