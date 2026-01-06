import { Grid } from "@mui/material";
import type { FC, ReactNode } from "react";
import { useAppSelector } from "../../Store/hooks";
import { CommonButton } from "../../Attribute";
import { useNavigate } from "react-router-dom";

interface CommonBottomActionBarProps {
  children?: ReactNode;
  isLoading?: boolean;
  save?: boolean;
  clear?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  onSave?: () => void;
  onSaveAndNew?: () => void;
}

const CommonBottomActionBar: FC<CommonBottomActionBarProps> = ({ children, isLoading,disabled, save, clear, onClear, onSave, onSaveAndNew }) => {
  const { isExpanded, isHovered } = useAppSelector((state) => state.layout);
  const navigate = useNavigate();

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 flex bg-white dark:bg-gray-900 lg:border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ${isExpanded || isHovered ? "lg:ml-[290px] lg:w-[calc(100%-290px)]" : "lg:ml-[90px] lg:w-[calc(100%-90px)]"}`}>
      <Grid container spacing={2} className="w-full! flex items-center justify-between mx-5 my-4">
        {children}
        {clear && (
          <>
            <Grid sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
              <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Cancel" />
              <CommonButton variant="contained" onClick={onClear} title="Clear" />
            </Grid>
            <Grid sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
              <CommonButton type="submit" variant="contained" title="Save" onClick={onSave} loading={isLoading} disabled={disabled} />
              <CommonButton type="submit" variant="contained" title="Save & Create New" onClick={onSaveAndNew} loading={isLoading} disabled={disabled} />
            </Grid>
          </>
        )}
        {save && (
          <Grid sx={{ display: "flex", gap: 2 ,ml:"auto"}} >
            <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Back" />
            <CommonButton type="submit" variant="contained" title="Save" onClick={onSave} loading={isLoading} disabled={disabled} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default CommonBottomActionBar;
