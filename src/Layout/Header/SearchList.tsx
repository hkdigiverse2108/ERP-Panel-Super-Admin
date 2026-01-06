import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { CommonTextField } from "../../Attribute";
import { CommonDrawer } from "../../Components/Common";
import { NavItems } from "../../Data";

const SearchList = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return NavItems;

    return NavItems.filter((item) => {
      const matchMain = item.name.toLowerCase().includes(query.toLowerCase());
      const matchSub = item?.subItems?.some((s) => s.name.toLowerCase().includes(query.toLowerCase()));
      return matchMain || matchSub;
    });
  }, [query]);
  return (
    <>
      <div onClick={() => setOpen(!open)} className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 max-xsm:h-9 max-xsm:w-9 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
        <SearchSharpIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
      </div>
      <CommonDrawer open={open} onClose={() => setOpen(!open)} anchor="right" width={280} title="Search List" paperProps={{ className: "bg-white dark:bg-gray-800!" }}>
        <Grid sx={{ px: 1 }} container spacing={2}>
          <CommonTextField value={query} placeholder="Search..." grid={{ xs: 12 }} onChange={(e) => setQuery(e)} />
        </Grid>
        <ul className="space-y-3 mt-4">
          {filteredItems.map((section, idx) => (
            <li key={idx}>
              <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200">
                {/* Icon */}
                <span className="text-gray-600 dark:text-gray-300">{section.icon}</span>

                {/* Name */}
                {section.name}
              </div>

              {/* Subitems */}
              {section.subItems && (
                <ul className="ml-6 mt-2 space-y-1 border-l border-gray-300 pl-3 dark:border-gray-700">
                  {section.subItems.map((sub, subIdx) => (
                    <li key={subIdx} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 cursor-pointer">
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </CommonDrawer>
    </>
  );
};

export default SearchList;
