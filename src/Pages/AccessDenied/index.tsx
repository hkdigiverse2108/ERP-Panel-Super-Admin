import { useNavigate } from "react-router-dom";
import { ImagePath, ROUTES } from "../../Constants";
import ThemeToggler from "../../Layout/ThemeToggler";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      {/* background */}
      <div className="absolute right-0 top-0 -z-1 w-full max-w-62.5 xl:max-w-112.5">
        <img src={`${ImagePath}logo/grid-01.svg`} alt="grid" />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
        <img src={`${ImagePath}logo/grid-01.svg`} alt="grid" />
      </div>

      {/* content */}
      <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">ACCESS DENIED</h1>

        {/* <img src={`${ImagePath}error/403.svg`} alt="403" className="dark:hidden" /> */}
        {/* <img src={`${ImagePath}error/403-dark.svg`} alt="403" className="hidden dark:block" /> */}

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">You don’t have permission to access this page.</p>

        <div className="flex justify-center gap-4">
          <button onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-dark">
            Go Back
          </button>

          <button onClick={() => navigate(ROUTES.DASHBOARD)} className="rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-dark">
            Go to Dashboard
          </button>
        </div>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">&copy; {new Date().getFullYear()} - HK DigiVerse LLP</p>

      <div className="fixed bottom-5 right-5">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default AccessDenied;
