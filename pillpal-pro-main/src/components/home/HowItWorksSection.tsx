import { motion } from "framer-motion";
import { PlusCircle, Bell, BarChart3, Users, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: PlusCircle,
    title: "Add Your Medications",
    description: "Easily add all your medications with dosage, frequency, and timing preferences. Our smart form makes it quick and intuitive.",
    color: "bg-primary",
  },
  {
    icon: Bell,
    title: "Get Smart Reminders",
    description: "Receive personalized notifications via app, email, or SMS. Never miss a dose with our intelligent reminder system.",
    color: "bg-accent",
  },
  {
    icon: BarChart3,
    title: "Track & Analyze",
    description: "Monitor your adherence patterns with beautiful charts. AI detects missed-dose trends and suggests improvements.",
    color: "bg-success",
  },
  {
    icon: Users,
    title: "Connect Caregivers",
    description: "Share your progress with family or healthcare providers. Get support when you need it most.",
    color: "bg-warning",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple & Effective
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="text-gradient">PillMate</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. Our intuitive platform makes medication management effortless.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-success transform -translate-y-1/2 z-0" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full hover:shadow-lg transition-shadow duration-300 group">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
