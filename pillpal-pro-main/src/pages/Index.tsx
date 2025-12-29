import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";
import AIToolSection from "@/components/home/AIToolSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pillmate-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(stored === "dark" || (!stored && prefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      <Helmet>
        <title>PillMate - Your Intelligent Medication Companion</title>
        <meta
          name="description"
          content="Never miss a dose again with PillMate. AI-powered medication reminders, smart scheduling, and health insights for perfect medication adherence."
        />
        <meta name="keywords" content="medication reminder, pill tracker, medicine schedule, health app, medication adherence" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <FeaturesSection />
          <AIToolSection />
          <BlogSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
