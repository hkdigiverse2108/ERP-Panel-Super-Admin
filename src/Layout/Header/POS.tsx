import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const POS = () => {
  return (
    <div className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 max-xsm:h-9 max-xsm:w-9 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
      <CalendarMonthOutlinedIcon sx={{ fontSize: { xs: 20, md: 22 } }}/>
    </div>
  );
};

export default POS;
