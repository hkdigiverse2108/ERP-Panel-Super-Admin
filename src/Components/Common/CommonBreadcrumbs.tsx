import { Breadcrumbs, Typography } from "@mui/material";
import type { FC } from "react";
import type { BreadcrumbHeaderProps, BreadcrumbItem } from "../../Types";
import { ROUTES } from "../../Constants";
import { Link } from "react-router-dom";

const CommonBreadcrumbs: FC<BreadcrumbHeaderProps> = ({ title, maxItems = 2, breadcrumbs = [] }) => {
  const finalBreadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: ROUTES.DASHBOARD }, ...breadcrumbs];
  const validMaxItems = Math.max(maxItems, 2);
  
  return (
    <div className="relative flex w-full flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 capitalize">{title}</h2>
      <nav>
        <Breadcrumbs maxItems={validMaxItems} aria-label="breadcrumb">
          {finalBreadcrumbs.map((item, index) =>
            item.href ? (
              <Link key={index} to={item.href} className="text-gray-500! dark:text-gray-400! capitalize">
                {item.label}
              </Link>
            ) : (
              <Typography key={index} variant="subtitle1" fontWeight={400} className="text-gray-700 dark:text-gray-200 capitalize">
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      </nav>
    </div>
  );
};

export default CommonBreadcrumbs;
