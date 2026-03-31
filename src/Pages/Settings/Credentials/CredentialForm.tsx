import { useState } from "react";
import { PAGE_TITLE } from "../../../Constants";

const CredentialForm = () => {
  const [formData, setFormData] = useState({
    projectId: "",
    supabaseUrl: "",
    publishableKey: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving credential:", formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{PAGE_TITLE.CREDENTIALS.ADD}</h1>
        <p className="text-muted-foreground text-sm">Add a new Supabase project for AI rotation logic.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-border rounded-2xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Project ID</label>
          <input 
            type="text" 
            placeholder="e.g. gvnwsvvmgfjahyrqijuz"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.projectId}
            onChange={(e) => setFormData({...formData, projectId: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Supabase URL</label>
          <input 
            type="url" 
            placeholder="https://your-project.supabase.co"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.supabaseUrl}
            onChange={(e) => setFormData({...formData, supabaseUrl: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Publishable Key</label>
          <textarea 
            placeholder="Enter your supabase anon key"
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
            value={formData.publishableKey}
            onChange={(e) => setFormData({...formData, publishableKey: e.target.value})}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Save Credential
          </button>
          <button type="button" className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl border border-border hover:bg-muted transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CredentialForm;
