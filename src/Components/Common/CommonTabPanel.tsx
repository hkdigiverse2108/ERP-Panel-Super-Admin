import { type FC } from "react";
import type { TabPanelProps } from "../../Types";

const CommonTabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
};

export default CommonTabPanel;
