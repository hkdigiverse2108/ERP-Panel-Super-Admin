import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Badge, Box, IconButton } from "@mui/material";
import { Queries } from "../../Api";
import { FormatDate } from "../../Utils";
import { useAppDispatch } from "../../Store/hooks";
import { setModalVideoPlay } from "../../Store/Slices/ModalSlice";

const ImportantAnnouncement = () => {
  const dispatch = useAppDispatch();
  const { data: announcementData } = Queries.useGetAnnouncement();
  const Data = announcementData?.data?.announcement_data;
  const handleVideoOpen = (link: string) => dispatch(setModalVideoPlay({ open: true, link: link }));

  return (
    <Box className="relative group">
      {/* ICON BUTTON */}
      <IconButton className="relative flex items-center justify-center text-gray-500 transition-colors max-xsm:h-9 max-xsm:w-9 bg-white border! border-gray-200! rounded-full dark:border-gray-800! dark:bg-gray-900! dark:text-gray-400! dark:hover:bg-gray-800! dark:hover:text-white cursor-pointer">
        <Badge color="warning" variant="dot">
          <NotificationsNoneIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </Badge>
      </IconButton>

      {/* DROPDOWN */}
      <div className="fixed lg:absolute max-lg:left-1 max-lg:right-1 lg:right-0 mt-3 flex max-h-[480px] min-w-[285px] md:min-w-[330px] max-w-[350px] flex-col rounded-xl border border-gray-50 bg-white shadow-tooltip dark:border-gray-800 dark:bg-gray-dark z-50 opacity-0 invisible scale-95 translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0">
        {/* HEADER */}
        <div className="flex items-center justify-center p-3 mb-3 border-b border-gray-300 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Important Announcement</h5>
        </div>

        {/* LIST */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar px-3">
          {Data?.map((item, index) => (
            <li key={index}>
              <div className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5">
                <span className="block">
                  <span className="flex justify-between items-center mb-1.5 text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      Version {item.version}
                      {item.link && <YouTubeIcon className="text-red-500 ms-2" onClick={() => handleVideoOpen(item.link)} />}
                    </span>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">{FormatDate(item.version)}</span>
                  </span>
                  <ul className="mb-1.5 ml-4 list-disc text-theme-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {item.desc.map((descItem, index) => (
                      <li key={index}>{descItem}</li>
                    ))}
                  </ul>
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        {/* <Link to="/" className="block px-4 py-2 m-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
          View All Notifications
        </Link> */}
      </div>
    </Box>
  );
};

export default ImportantAnnouncement;
