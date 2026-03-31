import { useState } from "react";
import { PAGE_TITLE } from "../../../Constants";

const SpecialForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving special item:", formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-body">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{PAGE_TITLE.INVENTORY.SPECIALS.ADD}</h1>
        <p className="text-muted-foreground text-sm tracking-tight text-black">Add a global special item for AI identification (takes priority over inventory).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-border rounded-3xl shadow-sm text-black">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-widest text-[#f97316]">Item Name</label>
          <input 
            type="text" 
            placeholder="e.g. KitKat Large"
            className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-widest text-[#f97316]">Price (₹)</label>
          <input 
            type="number" 
            placeholder="30"
            className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-widest text-[#f97316]">Description</label>
          <textarea 
            placeholder="Optional details for the AI..."
            className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none min-h-[120px] font-medium"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="pt-6 flex gap-4">
          <button type="submit" className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
            Save Special Item
          </button>
          <button type="button" className="px-8 py-4 bg-secondary text-foreground font-bold rounded-2xl border border-border hover:bg-muted transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialForm;
