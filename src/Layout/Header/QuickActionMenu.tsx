import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SegmentIcon from "@mui/icons-material/Segment";
import { Box } from "@mui/material";
import { useState } from "react";
import { CommonDrawer } from "../../Components/Common";
import { useWindowWidth } from "../../Utils/Hooks";

const menuData = [
  { title: "Sales", items: ["Invoice", "Credit Note"] },
  {
    title: "Bank / Cash",
    items: ["Bank", "Bank Transaction", "Receipt", "Payment"],
  },
  { title: "Purchase", items: ["Supplier Bill", "Debit Note"] },
  { title: "Contact", items: ["Contact"] },
  {
    title: "Inventory",
    items: ["Product", "Stock Transfer", "Price Master"],
  },
];

const QuickActionMenu = () => {
  const width = useWindowWidth();
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  return (
    <>
      {width >= 1024 ? (
        <Box className="relative group">
          <p className="flex text-base font-bold items-center justify-center text-gray-700 bg-white cursor-pointer hover:text-dark dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white">
            Quick Action
            <ExpandMoreIcon />
          </p>
          <div className="absolute left-0 mt-3 z-50 w-[820px] rounded-lg border border-gray-50 bg-white shadow-tooltip dark:border-gray-800 dark:bg-gray-800 opacity-0 invisible scale-95 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0">
            <div className="grid grid-cols-5 p-2">
              {menuData.map((section, index) => (
                <div key={section.title} className={`${index !== menuData.length - 1 ? "border-r border-gray-100 dark:border-gray-700" : ""}  p-2`}>
                  <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{section.title}</p>
                  <ul className="flex flex-col pt-0">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 px-3 py-2 font-medium text-gray-600 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Box>
      ) : (
        <Box>
          {/* ─────────────── MOBILE BUTTON ─────────────── */}
          <button onClick={toggleDrawer(true)} className="flex items-center justify-center w-10 h-10 text-gray-400 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <SegmentIcon />
          </button>

          {/* ─────────────── MOBILE DRAWER ─────────────── */}
          <CommonDrawer open={open} onClose={toggleDrawer(false)} anchor="left" width={280} title="Quick Action" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
            <ul className="space-y-3">
              {menuData.map((section, idx) => (
                <li key={section.title}>
                  <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="flex items-center justify-between w-full py-2 text-left text-gray-700 dark:text-gray-300">
                    <span>{section.title}</span>
                    <KeyboardArrowDownRoundedIcon className={`transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all ${openIndex === idx ? "max-h-40" : "max-h-0"}`}>
                    <ul className="ml-4 mt-2 space-y-2 border-l border-gray-300 pl-3">
                      {section.items.map((item) => (
                        <li key={item} className="text-sm text-gray-600 dark:text-gray-400">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </CommonDrawer>
        </Box>
      )}
    </>
  );
};

export default QuickActionMenu;
