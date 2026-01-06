import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Box } from "@mui/material";

const FinancialYear = () => {
  return (
    <Box className="relative group">
      <div className="flex text-center items-center justify-center w-fit max-xsm:px-0 px-2 h-10 max-sm:text-xs text-sm text-gray-500 border border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:border" aria-label="Toggle Sidebar">
        2025 - 2026
      </div>
      <div className="fixed lg:absolute max-lg:left-1 max-lg:right-1 lg:right-0 mt-3 flex min-w-[200px] max-w-[330px] flex-col rounded-xl border border-gray-50 bg-white shadow-tooltip dark:border-gray-800 dark:bg-gray-dark z-50 opacity-0 invisible scale-95 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 ">
        <div className="flex justify-center items-center p-3 mb-3 border-b border-gray-300 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Financial Year</h5>
        </div>
        <div className="p-3">
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3 border-b pb-3 border-gray-100 dark:border-gray-800">
              <CalendarMonthOutlinedIcon className="text-gray-700 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-300">2024 - 2025</span>
            </li>

            <li className="flex items-center gap-3 border-b pb-3 border-gray-100 dark:border-gray-800">
              <CalendarMonthOutlinedIcon className="text-gray-700 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-300">2025 - 2026</span>
            </li>
          </ul>
        </div>
      </div>
    </Box>  
  );
};

export default FinancialYear;
