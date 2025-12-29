import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HealthInsight {
  type: "tip" | "warning" | "success";
  title: string;
  description: string;
}

const AIToolSection = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<HealthInsight[]>([]);

  const exampleQueries = [
    "I keep forgetting my morning medications",
    "What time should I take vitamins?",
    "How can I track multiple medications?",
    "Tips for medication adherence",
  ];

  const generateInsights = async () => {
    if (!query.trim()) {
      toast.error("Please enter a question or concern");
      return;
    }

    setIsLoading(true);
    
    // Simulated AI response - in production, this would call the backend
    setTimeout(() => {
      const mockInsights: HealthInsight[] = [
        {
          type: "tip",
          title: "Set Consistent Reminder Times",
          description: "Link your medication times to daily routines like meals or brushing teeth. This creates automatic mental triggers that improve adherence by up to 30%.",
        },
        {
          type: "success",
          title: "Use PillMate's Smart Reminders",
          description: "Enable multi-channel notifications to receive reminders via push, email, and SMS. Our AI learns your patterns and sends reminders at optimal times.",
        },
        {
          type: "warning",
          title: "Avoid Missing Consecutive Doses",
          description: "Missing two or more consecutive doses can affect medication effectiveness. If this happens, consult your healthcare provider for guidance.",
        },
      ];
      
      setInsights(mockInsights);
      setIsLoading(false);
      toast.success("AI insights generated!");
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "success":
        return "bg-success/10 border-success/20";
      default:
        return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <section id="ai-tool" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Health Assistant</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get Personalized <span className="text-gradient">Health Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask our AI assistant about medication management, adherence tips, or any health concerns.
          </p>
        </motion.div>

        {/* AI Tool Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-lg">
            {/* Input Area */}
            <div className="mb-6">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about medication reminders, adherence tips, or health concerns..."
                className="min-h-[120px] resize-none bg-background/50 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap gap-2 mb-6">
              {exampleQueries.map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              variant="hero"
              size="lg"
              onClick={generateInsights}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Get AI Insights
                </>
              )}
            </Button>

            {/* Results */}
            <AnimatePresence>
              {insights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-4"
                >
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Recommendations
                  </h3>
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${getInsightBg(insight.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIToolSection;
