import { AutoAwesome, CameraAlt, LibraryAdd, Receipt, Refresh, Search } from "@mui/icons-material";
import { Box, Grid, Stack, Typography, Skeleton, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { Mutations } from "../../Api";
import { CommonButton } from "../../Attribute";
import { CommonCard } from "../../Components/Common";
import { PAGE_TITLE } from "../../Constants";
import type { DetectedItem } from "../../Types";

const BillSnap = () => {
  const theme = useTheme();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [identifiedItems, setIdentifiedItems] = useState<DetectedItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyzeTable, isPending: isScanning } = Mutations.useAnalyzeTable();

  // Helper to resize and compress image to keep payload small and fast
  const resizeAndCompressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.5)); // 0.5 quality and 800px ensures payload < 500KB
      };
    });
  };

  const handleScan = () => {
    if (!capturedImage) return;

    analyzeTable(
      { imageBase64: capturedImage },
      {
        onSuccess: (response) => {
          setIdentifiedItems(response.data || []);
        },
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        // Compress before setting in state to ensure fast UI and fast API
        const compressedBase64 = await resizeAndCompressImage(base64);
        setCapturedImage(compressedBase64);
        setIdentifiedItems([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalAmount = identifiedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "calc(100vh - 80px)", bgcolor: "background.default" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <AutoAwesome sx={{ color: "primary.main", fontSize: "1.75rem", animation: "pulse 2s infinite" }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.025em" }}>
              {PAGE_TITLE.BILLSNAP.BASE}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            AI-powered item detection and billing for rapid checkouts.
          </Typography>
        </Box>
        <CommonButton 
          startIcon={<LibraryAdd />} 
          onClick={() => fileInputRef.current?.click()} 
          title="Upload Photo" 
          variant="outlined"
          sx={{ borderRadius: 3, px: 3 }}
        />
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
      </Stack>

      <Grid container spacing={4}>
        {/* Left Section: Camera/Image View */}
        <Box sx={{ flexBasis: { xs: "100%", lg: "58.33%" }, flexGrow: 0, maxWidth: { xs: "100%", lg: "58.33%" } }}>
          <Stack spacing={2}>
            <Box
              sx={{
                aspectRatio: "4/3",
                bgcolor: "background.paper",
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: theme.shadows[1],
                transition: "border-color 0.3s",
                "&:hover": { borderColor: "primary.light" },
              }}
            >
              {capturedImage ? (
                <Box component="img" src={capturedImage} alt="Captured" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Box sx={{ textAlign: "center", p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "secondary.light",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      opacity: 0.7,
                    }}
                  >
                    <CameraAlt sx={{ fontSize: "2rem", color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Waiting for photo...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mx: "auto" }}>
                    Upload an image produced from your camera to begin AI analysis.
                  </Typography>
                </Box>
              )}

              {isScanning && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        border: "4px solid",
                        borderColor: "primary.main",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", animation: "pulse 1.5s infinite" }}>
                      Analyzing Table...
                    </Typography>
                  </Stack>
                  {/* Scanline Effect */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "2px",
                      bgcolor: "primary.main",
                      boxShadow: "0 0 15px rgba(249, 115, 22, 0.8)",
                      animation: "scanline 2.5s linear infinite",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={2}>
              <CommonButton
                sx={{ flex: 1, py: 2, borderRadius: 4, fontWeight: "bold", boxShadow: "0 10px 20px -10px rgba(249, 115, 22, 0.4)" }}
                disabled={!capturedImage || isScanning}
                onClick={handleScan}
                startIcon={<AutoAwesome />}
                title={identifiedItems.length > 0 ? "Rescan Table" : "Scan Table"}
              />
              <CommonButton
                onClick={() => {
                  setCapturedImage(null);
                  setIdentifiedItems([]);
                }}
                disabled={isScanning}
                startIcon={<Refresh />}
                title=""
                variant="outlined"
                sx={{ borderRadius: 4, px: 3 }}
              />
            </Stack>
          </Stack>
        </Box>

        {/* Right Section: Results/Checkout */}
        <CommonCard 
            grid={{ xs: 12, lg: 5 }} 
            hideDivider
            paperProps={{ 
                sx: { 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    minHeight: 480, 
                    p: 0,
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: 'divider'
                } 
            }}
        >
            <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Receipt sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Detected Items
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: "secondary.light", color: "text.secondary", px: 1, py: 0.5, borderRadius: 1, textTransform: "uppercase" }}>
                {identifiedItems.length} found
              </Typography>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflowY: "auto", maxHeight: 400 }}>
              {isScanning ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 4 }} />
                  ))}
                </Stack>
              ) : identifiedItems.length > 0 ? (
                <Stack spacing={1.5}>
                  {identifiedItems.map((item, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: item.matched ? "divider" : "error.light",
                        bgcolor: item.matched ? "background.paper" : "error.lighter",
                        transition: "all 0.2s",
                        "&:hover": { transform: "translateX(4px)", borderColor: "primary.light" },
                      }}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                          {!item.matched && (
                            <Typography variant="caption" sx={{ bgcolor: "error.main", color: "white", px: 1, borderRadius: 0.5, fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem" }}>
                              New
                            </Typography>
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {item.sku_code !== "N/A" ? `SKU: ${item.sku_code}` : "Match manually"}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800 }}>
                          ₹{item.price * item.quantity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          {item.quantity} units
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4, py: 8 }}>
                  <Search sx={{ fontSize: "4rem", mb: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Scan the table to see items here
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "divider", mt: "auto" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Amount
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  ₹{totalAmount}
                </Typography>
              </Stack>
              <CommonButton 
                fullWidth 
                title="Create ERP Invoice" 
                disabled={identifiedItems.length === 0 || isScanning} 
                sx={{ py: 2, borderRadius: 4, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }} 
              />
            </Box>
        </CommonCard>
      </Grid>

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default BillSnap;
