import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from '@mui/icons-material/Info';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { CommonButton } from "../../../../Attribute";
import { CommonModal } from "../../../Common";

const Discard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Discard">
        <div onClick={() => setOpen(!open)} className="head-icon">
          <DeleteForeverIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
        </div>
      </Tooltip>
      <CommonModal isOpen={open} onClose={() => setOpen(!open)} className="max-w-[400px] m-2 sm:m-5">
        <div className="flex flex-col items-center text-center px-6 py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-300 text-sky-400">
            <InfoIcon sx={{ fontSize: 34 }} />
          </div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Discard Sale ?</h2>
          <div className="flex gap-3">
            <CommonButton onClick={() => setOpen(false)} variant="outlined" startIcon={<ThumbDownAltIcon />}>Cancel</CommonButton>
            <CommonButton onClick={() => setOpen(false)} variant="contained" startIcon={<ThumbUpAltIcon />}>ok!</CommonButton>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default Discard;
