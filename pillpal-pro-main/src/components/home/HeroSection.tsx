import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, Calendar, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        {/* Floating Pills Animation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-6 h-12 rounded-full gradient-primary opacity-20"
            style={{
              left: `${15 + i * 18}%`,
              top: `${30 + (i % 3) * 15}%`,
              rotate: `${i * 30}deg`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Medication Management</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              Never Miss a
              <br />
              <span className="text-gradient">Dose Again</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Your intelligent medication companion with smart reminders, AI-powered insights, 
              and seamless calendar integration for complete health management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "98%", label: "Dose Adherence" },
                { value: "4.9★", label: "App Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                    <Bell className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Today's Medications</h3>
                    <p className="text-sm text-muted-foreground">3 of 5 doses taken</p>
                  </div>
                </div>

                {/* Medicine List */}
                <div className="space-y-3">
                  {[
                    { name: "Vitamin D3", time: "8:00 AM", taken: true, color: "bg-success" },
                    { name: "Omega-3", time: "12:00 PM", taken: true, color: "bg-success" },
                    { name: "Metformin", time: "2:00 PM", taken: true, color: "bg-success" },
                    { name: "Blood Pressure", time: "6:00 PM", taken: false, color: "bg-warning" },
                    { name: "Multivitamin", time: "9:00 PM", taken: false, color: "bg-muted" },
                  ].map((med, i) => (
                    <motion.div
                      key={med.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        med.taken ? "bg-success/10" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${med.color}`} />
                        <span className="font-medium text-foreground">{med.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{med.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Synced with Calendar</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
