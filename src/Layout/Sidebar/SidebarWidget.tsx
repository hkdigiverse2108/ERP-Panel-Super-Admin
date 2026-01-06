import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const SidebarWidget = () => {
  const iconClass = "flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200";

  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-gray-dark">
      <p className="mb-4 text-gray-700 text-theme-sm dark:text-gray-400">Want insider tips & updates? Follow us:</p>

      <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
        {/* Facebook */}
        <a href="https://www.facebook.com/PimjoHQ" target="_blank" rel="noopener" className={iconClass}>
          <FacebookIcon fontSize="medium" />
        </a>

        {/* X (Twitter) */}
        <a href="https://x.com/PimjoHQ" target="_blank" rel="noopener" className={iconClass}>
          <XIcon fontSize="medium" />
        </a>

        {/* LinkedIn */}
        <a href="https://www.linkedin.com/company/pimjo" target="_blank" rel="noopener" className={iconClass}>
          <LinkedInIcon fontSize="medium" />
        </a>

        {/* Instagram */}
        <a href="https://instagram.com/PimjoHQ" target="_blank" rel="noopener" className={iconClass}>
          <InstagramIcon fontSize="medium" />
        </a>
      </div>
    </div>
  );
};

export default SidebarWidget;
