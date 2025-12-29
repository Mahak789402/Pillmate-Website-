import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-8 h-16 rounded-full bg-primary-foreground/10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              rotate: `${i * 20}deg`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8"
          >
            <Pill className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Start Your Journey to
            <br />
            Better Health Today
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join over 50,000 users who have improved their medication adherence with PillMate. 
            Start your free trial now – no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-pill shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="glass"
                size="xl"
                className="w-full sm:w-auto border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
