import { Link } from "react-router-dom";
import { ImagePath, ROUTES } from "../../Constants";
import ThemeToggler from "../../Layout/ThemeToggler";

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img src={`${ImagePath}logo/grid-01.svg`} alt="grid" />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img src={`${ImagePath}logo/grid-01.svg`} alt="grid" />
      </div>
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">ERROR</h1>

        <img src={`${ImagePath}error/404.svg`} alt="404" className="dark:hidden" />
        <img src={`${ImagePath}error/404-dark.svg`} alt="404" className="hidden dark:block" />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">We can’t seem to find the page you are looking for!</p>

        <Link to={ROUTES.HOME} className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-dark dark:hover:text-gray-200">
          Back to Home Page
        </Link>
      </div>
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">&copy; {new Date().getFullYear()} - HK DigiVerse LLP</p>
      <div className="fixed bottom-5  right-5 ">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default NotFound;
