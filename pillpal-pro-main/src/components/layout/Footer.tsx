import { Link } from "react-router-dom";
import { Pill, Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "AI Insights", href: "/insights" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Pill<span className="text-gradient">Mate</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your intelligent medication companion. Never miss a dose with AI-powered reminders and health insights.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="mailto:support@pillmate.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                support@pillmate.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PillMate. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for better health
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
