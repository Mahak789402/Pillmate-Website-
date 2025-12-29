import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is PillMate free to use?",
    answer: "Yes! PillMate offers a generous free tier that includes up to 5 medications, basic reminders, and adherence tracking. Premium features like AI insights, caregiver sharing, and Google Calendar sync are available with our Pro plan.",
  },
  {
    question: "How does the AI detect missed-dose patterns?",
    answer: "Our AI analyzes your medication history, timing patterns, and lifestyle factors to identify when you're most likely to miss doses. It then provides personalized recommendations and can predict high-risk times to send proactive reminders.",
  },
  {
    question: "Can I share my medication schedule with my doctor?",
    answer: "Absolutely! You can invite caregivers, family members, or healthcare providers to view your medication schedule and adherence history. They'll receive alerts if you miss important doses.",
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, security is our top priority. PillMate is HIPAA compliant and uses end-to-end encryption for all your health data. We never sell or share your personal information with third parties.",
  },
  {
    question: "How does Google Calendar integration work?",
    answer: "Once connected, PillMate automatically creates calendar events for each medication dose. If you reschedule or miss a dose, your calendar updates in real-time. You can also set up calendar notifications as an additional reminder layer.",
  },
  {
    question: "What types of reminders can I receive?",
    answer: "PillMate supports push notifications, email reminders, SMS alerts, and in-app popups. You can customize which methods you prefer for each medication and set different reminder times before your scheduled dose.",
  },
  {
    question: "Can PillMate track supplements and vitamins too?",
    answer: "Yes! PillMate can track any medication, vitamin, supplement, or health routine. Whether it's daily vitamins, weekly injections, or monthly treatments, our flexible scheduling handles it all.",
  },
  {
    question: "What happens if I miss a dose?",
    answer: "PillMate will notify you and your connected caregivers (if enabled). Our AI will suggest the safest time to take the missed dose based on your medication interactions and schedule. You can also log the miss for accurate adherence tracking.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about PillMate and how it can help you manage your medications.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
