import React, { useState, useRef } from "react";
import { PAGE_TITLE } from "../../Constants";
import { CameraAlt, LibraryAdd, AutoAwesome, Refresh, Search, Receipt } from "@mui/icons-material";

const BillSnap = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [identifiedItems, setIdentifiedItems] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    setIsScanning(true);
    // Mimic scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setIdentifiedItems([
        { name: "KitKat Large", price: 30, quantity: 2, matched: true, sku: "KK001" },
        { name: "Rice 1kg", price: 65, quantity: 1, matched: true, sku: "RIC-01" },
        { name: "Unknown Item", price: 0, quantity: 1, matched: false, sku: "N/A" },
      ]);
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setIdentifiedItems([]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 min-h-[calc(100vh-80px)] bg-background font-body">
      {/* Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AutoAwesome className="text-primary text-2xl animate-pulse" />
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{PAGE_TITLE.BILLSNAP.BASE}</h1>
          </div>
          <p className="text-muted-foreground text-sm">AI-powered item detection and billing for rapid checkouts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <LibraryAdd className="text-sm" /> Upload Photo
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sticky top-0">
        
        {/* Left Section: Camera/Image View */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="aspect-[4/3] bg-card border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group shadow-sm transition-all hover:border-primary/50">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <CameraAlt className="text-3xl text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Waiting for photo...</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">Upload an image of items on the table to begin AI analysis.</p>
                </div>
            )}
            
            {isScanning && (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-white font-bold text-lg animate-pulse">Analyzing Image...</p>
                </div>
                {/* Scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#f97316] animate-scanline"></div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button 
              disabled={!capturedImage || isScanning}
              onClick={handleScan}
              className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
            >
              <AutoAwesome /> {identifiedItems.length > 0 ? 'Rescan Table' : 'Scan Table'}
            </button>
            <button 
               onClick={() => { setCapturedImage(null); setIdentifiedItems([]); }}
               className="px-6 bg-secondary text-foreground rounded-2xl font-bold border border-border hover:bg-muted"
            >
              <Refresh />
            </button>
          </div>
        </div>

        {/* Right Section: Results/Checkout */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Receipt className="text-primary" /> Detected Items
              </h2>
              <span className="text-xs font-bold bg-secondary text-muted-foreground px-2 py-1 rounded-md uppercase">
                {identifiedItems.length} found
              </span>
            </div>

            {identifiedItems.length > 0 ? (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 mb-6">
                {identifiedItems.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex justify-between items-center group transition-all hover:translate-x-1 ${item.matched ? 'bg-white border-border hover:border-primary/30' : 'bg-destructive/5 border-destructive/20'}`}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.name}</span>
                        {!item.matched && <span className="text-[10px] font-bold bg-destructive text-white px-1.5 py-0.5 rounded uppercase">New</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.sku !== 'N/A' ? `SKU: ${item.sku}` : 'Match manually'}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹{item.price * item.quantity}</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">{item.quantity} units</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Search className="text-5xl mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Scan the table to see items here</p>
              </div>
            )}

            <div className="mt-auto space-y-4 pt-6 border-t border-border">
              <div className="flex justify-between items-end">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className="text-3xl font-black text-foreground">₹{identifiedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
              </div>
              <button 
                disabled={identifiedItems.length === 0}
                className="w-full py-4 bg-foreground text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
              >
                Create ERP Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default BillSnap;
