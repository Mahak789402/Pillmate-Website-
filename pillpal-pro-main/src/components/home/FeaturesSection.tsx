import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Bell,
  BarChart3,
  Shield,
  Smartphone,
  Users,
  RefreshCcw,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Detect missed-dose patterns and get personalized recommendations to improve adherence.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Calendar,
    title: "Google Calendar Sync",
    description: "Automatically sync your medication schedule with Google Calendar for seamless planning.",
    gradient: "from-accent to-warning",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Multi-channel notifications via push, email, and SMS ensure you never miss a dose.",
    gradient: "from-success to-primary",
  },
  {
    icon: BarChart3,
    title: "Adherence Analytics",
    description: "Beautiful visualizations of your medication history and adherence trends.",
    gradient: "from-warning to-accent",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your health data is encrypted and protected with enterprise-grade security.",
    gradient: "from-primary to-success",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Access PillMate from any device - web, iOS, or Android with full sync.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Users,
    title: "Caregiver Support",
    description: "Share your medication schedule with family members or healthcare providers.",
    gradient: "from-success to-warning",
  },
  {
    icon: RefreshCcw,
    title: "Refill Reminders",
    description: "Get notified before you run out of medication with smart refill tracking.",
    gradient: "from-warning to-primary",
  },
  {
    icon: Zap,
    title: "Smart Rescheduling",
    description: "AI suggests optimal times to take missed doses safely without conflicts.",
    gradient: "from-primary to-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need for
            <br />
            <span className="text-gradient">Better Health</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From smart reminders to AI insights, PillMate provides all the tools for perfect medication adherence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
