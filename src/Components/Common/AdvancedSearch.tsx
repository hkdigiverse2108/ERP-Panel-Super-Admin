import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
// import { CommonSelect } from "../../Attribute";
import { type FC, type ReactNode } from "react";
// import { PRODUCT_TYPE_OPTIONS } from "../../Data";

const AdvancedSearch:FC<{children?: ReactNode}> = ({children}) => {
  // const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <Accordion className="advanced-search">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography component="span">Advanced Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1.5} className="flex items-center">
            {children}
            {/* <Grid size={{ xs: 12, xsm: 6, sm: 3, xxl: 2 }}>
              <CommonSelect label="Select Location" options={PRODUCT_TYPE_OPTIONS} value={value} onChange={(v) => setValue(v)} limitTags={1} multiple/>
            </Grid> */}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AdvancedSearch;
