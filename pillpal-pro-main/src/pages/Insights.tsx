import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Pill,
  ChevronLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Insights = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pillmate-theme");
    setIsDark(stored === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const insights = [
    {
      type: "pattern",
      icon: TrendingDown,
      title: "Evening Dose Pattern Detected",
      description: "You tend to miss your 6 PM medication on weekends. Consider setting an extra reminder or adjusting the time.",
      severity: "warning",
    },
    {
      type: "prediction",
      icon: AlertTriangle,
      title: "High-Risk Period Approaching",
      description: "Based on your history, next Tuesday has a 73% chance of missed doses. We'll send extra reminders.",
      severity: "warning",
    },
    {
      type: "success",
      icon: TrendingUp,
      title: "Morning Adherence Improved",
      description: "Your 8 AM medication adherence improved by 25% this week. Great job maintaining the routine!",
      severity: "success",
    },
    {
      type: "suggestion",
      icon: Lightbulb,
      title: "Optimal Rescheduling",
      description: "Moving your Omega-3 to breakfast time could improve absorption and adherence based on your patterns.",
      severity: "info",
    },
  ];

  const weeklyData = [
    { day: "Mon", adherence: 100 },
    { day: "Tue", adherence: 80 },
    { day: "Wed", adherence: 100 },
    { day: "Thu", adherence: 100 },
    { day: "Fri", adherence: 60 },
    { day: "Sat", adherence: 80 },
    { day: "Sun", adherence: 100 },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "warning":
        return "bg-warning/10 border-warning/20 text-warning";
      case "success":
        return "bg-success/10 border-success/20 text-success";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Insights | PillMate</title>
        <meta name="description" content="Get AI-powered insights about your medication adherence patterns and personalized recommendations." />
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
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">AI Health Insights</h1>
            </div>
            <p className="text-muted-foreground">Personalized analysis and recommendations based on your medication patterns</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Weekly Adherence</h2>
                </div>

                <div className="flex items-end justify-between h-48 mb-4">
                  {weeklyData.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ height: 0 }}
                      animate={{ height: `${day.adherence}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="flex flex-col items-center gap-2 w-full"
                    >
                      <div
                        className={`w-8 sm:w-12 rounded-t-lg ${
                          day.adherence >= 80 ? "bg-success" : day.adherence >= 60 ? "bg-warning" : "bg-destructive"
                        }`}
                        style={{ height: `${day.adherence}%` }}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="text-center w-full">
                      <span className="text-sm text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">88.6%</div>
                    <div className="text-sm text-muted-foreground">Weekly Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">+5%</div>
                    <div className="text-sm text-muted-foreground">vs Last Week</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">31</div>
                    <div className="text-sm text-muted-foreground">Doses Taken</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass rounded-2xl p-6 text-center">
                <h2 className="text-lg font-semibold text-foreground mb-6">Health Score</h2>
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * 0.89) }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">89</span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12 points this month</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">AI Recommendations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`glass rounded-2xl p-5 border ${getSeverityStyles(insight.severity).replace("text-", "border-").replace("/10", "/20")}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${getSeverityStyles(insight.severity).split(" ")[0]}`}>
                      <insight.icon className={`w-5 h-5 ${getSeverityStyles(insight.severity).split(" ")[2]}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Insights;
