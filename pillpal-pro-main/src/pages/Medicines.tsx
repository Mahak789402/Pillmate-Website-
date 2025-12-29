import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Pill,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Package,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import api from "@/lib/axios";

// ... existing imports

interface Medicine {
  id: string; // ID is string from MongoDB
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  stock: number;
  color: string;
}

const Medicines = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
    time: "",
    stock: "",
  });

  const fetchMedicines = async () => {
    try {
      const { data } = await api.get('/medicines');
      const formatted = data.map((med: any) => ({
        id: med._id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        time: med.times[0],
        stock: med.currentStock,
        color: "bg-primary" // Default color, or random
      }));
      setMedicines(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load medicines");
    }
  };

  useEffect(() => {
    fetchMedicines();
    const stored = localStorage.getItem("pillmate-theme");
    setIsDark(stored === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pillmate-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const filteredMeds = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedicine = async () => {
    if (!newMed.name || !newMed.dosage || !newMed.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await api.post('/medicines', {
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        times: [newMed.time],
        startDate: new Date(),
        currentStock: parseInt(newMed.stock) || 0,
        refillThreshold: 5
      });
      toast.success(`${newMed.name} added successfully!`);
      setIsAddOpen(false);
      setNewMed({ name: "", dosage: "", frequency: "Daily", time: "", stock: "" });
      fetchMedicines();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add medicine");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(medicines.filter((med) => med.id !== id));
      toast.success("Medicine removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete medicine");
    }
  };

  const handleAction = async (id: string, status: 'Taken' | 'Missed') => {
    try {
      await api.post('/logs', {
        medicineId: id,
        status: status,
        takenAt: new Date()
      });

      const msg = status === 'Taken' ? "Marked as Taken" : "Marked as Missed";
      toast.success(msg);

      // Update stock locally if taken
      if (status === 'Taken') {
        setMedicines(medicines.map(m => {
          if (m.id === id) {
            return { ...m, stock: Math.max(0, m.stock - 1) };
          }
          return m;
        }));
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to log dose");
    }
  };

  return (
    <>
      <Helmet>
        <title>Medicines | PillMate</title>
        <meta name="description" content="Manage your medications with PillMate. Add, edit, and track all your medicines in one place." />
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

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Medicines</h1>
              <p className="text-muted-foreground">Manage all your medications in one place</p>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong border-border">
                <DialogHeader>
                  <DialogTitle>Add New Medicine</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Medicine Name *</Label>
                    <Input
                      placeholder="e.g., Aspirin"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      placeholder="e.g., 100mg"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={newMed.frequency}
                      onValueChange={(value) => setNewMed({ ...newMed, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="As Needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={newMed.time}
                      onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={newMed.stock}
                      onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
                    />
                  </div>
                  <Button variant="hero" className="w-full" onClick={handleAddMedicine}>
                    Add Medicine
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </motion.div>

          {/* Medicines Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeds.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-5 group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${med.color} rounded-xl flex items-center justify-center`}>
                    <Pill className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50" onClick={() => handleAction(med.id, 'Taken')} title="Mark as Taken">
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleAction(med.id, 'Missed')} title="Mark as Missed">
                      <XCircle className="w-5 h-5" />
                    </Button>
                    <div className="w-px h-4 bg-border mx-1 self-center" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(med.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-1">{med.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{med.dosage}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{med.frequency} at {med.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{med.stock} doses remaining</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMeds.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No medicines found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try a different search term" : "Add your first medicine to get started"}
              </p>
              <Button variant="hero" onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Medicines;
