import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Paper, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { CommonSelect } from "../../../../Attribute";
import { USER_TYPE } from "../../../../Data";
import { CommonDrawer } from "../../../Common";

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  
  const products = [
    { name: "Chocolate Cake", price: 350 },
    { name: "Chocolate Cake", price: 350 },
    { name: "Black Forest Cake", price: 400 },
    { name: "Black Forest Cake", price: 380 },
    { name: "Pineapple Cake", price: 380 },
    { name: "Red Velvet Cake", price: 650 },
    { name: "Red Velvet Cake", price: 700 },
    { name: "Plum Cake", price: 200 },
    { name: "Plum Cake", price: 220 },
  ];

  return (
    <>
      <Tooltip title="Product">
        <div onClick={() => setOpen(!open)} className="head-icon">
          <DashboardIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonDrawer open={open} onClose={() => setOpen(!open)} anchor="right" width={700} title="Product List" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
        <Box className="flex flex-col gap-5 text-gray-800 dark:text-gray-200">
          <CommonSelect label="Select Category and Subcategory" options={USER_TYPE} value={value} onChange={(v) => setValue(v)} limitTags={1} />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1.5 }}>
            {products.map((item, index) => (
              <Paper key={index} elevation={0} className="p-4 rounded-lg! cursor-pointer border border-gray-200! dark:border-gray-600! bg-gray-50! dark:bg-gray-800! hover:bg-gray-100! dark:hover:bg-gray-dark! hover:border-gray-300! dark:hover:border-gray-600!">
                <Typography fontWeight={600} noWrap title={item.name}>
                  {item.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Price : {item.price}.00 ₹
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </CommonDrawer>
    </>
  );
};

export default ProductList;
