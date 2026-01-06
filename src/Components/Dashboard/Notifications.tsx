import { Box } from "@mui/material";
import { ImagePath } from "../../Constants";
import { CommonCard } from "../Common";

const Notifications = () => {
  const notifications = [
    {
      img: "1",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "2",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "3",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "4",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "5",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "6",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "7",
      name: "Terry Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "5 min ago",
      status: "success",
    },
    {
      img: "8",
      name: "Alena Franci",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "8 min ago",
      status: "success",
    },
    {
      img: "9",
      name: "Jocelyn Kenter",
      text: "requests permission to change",
      project: "Project - Nganter App",
      time: "15 min ago",
      status: "success",
    },
  ];
  return (
    <CommonCard title="Notifications" grid={{ xs: 12, md: 4 }}>
      <Box className="flex flex-col max-h-[385px] overflow-y-auto custom-scrollbar">
        {notifications.map((item, index) => (
          <Box key={index}>
            <div className="flex items-center gap-3 border-b border-gray-100 p-3 px-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800">
              <span className="w-12 h-12 rounded-full overflow-hidden">
                <img src={`${ImagePath}user/${item.img}.jpg`} className="w-full h-full object-cover rounded-full" alt={item.name} />
              </span>
              <div className="flex flex-col">
                <span className="mb-1.5 text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                  <span className="block font-medium text-gray-800 dark:text-white">{item.name}</span>
                  <span>{item.text}</span>
                </span>
                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span> <span className="w-1 h-1 bg-gray-400 rounded-full"></span> <span>{item.time}</span>
                </span>
              </div>
            </div>
          </Box>
        ))}
      </Box>
    </CommonCard>
  );
};

export default Notifications;
