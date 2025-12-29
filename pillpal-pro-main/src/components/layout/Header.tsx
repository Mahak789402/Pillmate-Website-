import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Menu, X, Sun, Moon, User, LogOut, Calendar, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/medicines", label: "Medicines" },
    { href: "/schedule", label: "Schedule" },
    { href: "/insights", label: "AI Insights" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  const handleSyncCalendar = async () => {
    setIsSyncing(true);
    try {
      await api.post('/calendar/sync');
      toast.success("Calendar synced successfully!");
    } catch (error: any) {
      console.error(error);
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        toast.error("Please connect Google Calendar in Settings first");
        navigate('/settings');
      } else {
        toast.error("Failed to sync calendar");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md"
            >
              <Pill className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">
              Pill<span className="text-gradient">Mate</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {userInfo ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncCalendar}
                  disabled={isSyncing}
                  title="Sync with Google Calendar"
                >
                  <Calendar className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out">
                  <LogOut className="w-4 h-4 text-destructive" />
                </Button>
                <Link to="/dashboard">
                  <Button variant="hero" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>

                <Link to="/auth" className="hidden lg:block">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                {userInfo ? (
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Log Out
                  </Button>
                ) : (
                  <Link to="/auth" className="flex-1">
                    <Button variant="hero" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
