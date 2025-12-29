import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronRight, Pill, Activity, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/axios";
import Header from "@/components/layout/Header";

interface Patient {
    _id: string;
    name: string;
    email: string;
}

interface PatientData {
    medicines: any[];
    todayLogs: any[];
    alerts: any[];
}

const CaregiverDashboard = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        fetchPatients();
        const stored = localStorage.getItem("pillmate-theme");
        setIsDark(stored === "dark");
    }, []);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/caregivers/patients');
            setPatients(data);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        }
    };

    const fetchPatientData = async (patientId: string) => {
        try {
            setSelectedPatient(patientId);
            setPatientData(null); // Reset while loading
            const { data } = await api.get(`/caregivers/patients/${patientId}`);
            setPatientData(data);
        } catch (error) {
            console.error("Failed to fetch patient data", error);
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
        localStorage.setItem("pillmate-theme", newTheme ? "dark" : "light");
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Caregiver Dashboard | PillMate</title>
            </Helmet>
            <Header isDark={isDark} toggleTheme={toggleTheme} />

            <main className="container mx-auto px-4 py-8 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Caregiver Portal
                    </h1>
                    <p className="text-muted-foreground">Monitor and manage your patients' medication adherence.</p>
                </motion.div>

                {selectedPatient ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => setSelectedPatient(null)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Patient List
                        </Button>

                        {patientData ? (
                            <div className="space-y-8">
                                {/* Alerts Section */}
                                {patientData.alerts.length > 0 && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
                                        <h2 className="text-xl font-semibold text-destructive flex items-center gap-2 mb-4">
                                            <AlertTriangle className="w-5 h-5" />
                                            Recent Alerts
                                        </h2>
                                        <div className="space-y-3">
                                            {patientData.alerts.map((alert: any) => (
                                                <div key={alert._id} className="bg-background/50 p-3 rounded-xl flex items-start gap-3">
                                                    <div className="w-2 h-2 mt-2 rounded-full bg-destructive shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-foreground">{alert.message}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Medicines List */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Pill className="w-5 h-5 text-primary" />
                                                Active Medicines
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {patientData.medicines.map((med: any) => (
                                                <div key={med._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                                    <div>
                                                        <h3 className="font-medium">{med.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{med.dosage} - {med.currentStock} left</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">{med.frequency}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Today's Logs */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-accent" />
                                                Today's Activity
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {patientData.todayLogs.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-4">No activity recorded today yet.</p>
                                            ) : (
                                                patientData.todayLogs.map((log: any) => (
                                                    <div key={log._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                                        <div>
                                                            <h3 className="font-medium">{log.medicine.name}</h3>
                                                            <p className="text-xs text-muted-foreground">Scheduled: {new Date(log.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${log.status === 'Taken' ? 'bg-green-500/10 text-green-500' :
                                                                log.status === 'Missed' ? 'bg-red-500/10 text-red-500' :
                                                                    'bg-yellow-500/10 text-yellow-500'
                                                            }`}>
                                                            {log.status}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No patients assigned to you yet.</p>
                            </div>
                        ) : (
                            patients.map((patient) => (
                                <motion.div
                                    key={patient._id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => fetchPatientData(patient._id)}
                                    className="glass p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">{patient.name}</h3>
                                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CaregiverDashboard;
