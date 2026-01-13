import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import { type FC } from "react";
import { CommonSelect } from "../../Attribute";
import type { AdvancedSearchProps } from "../../Types";

const AdvancedSearch: FC<AdvancedSearchProps> = ({ children, filter = [] }) => {
  if (!filter.length && !children) return null;
  return (
    <>
      <Accordion className="advanced-search">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography component="span">Advanced Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1.5} className="flex items-center">
            {filter.map((item, i) => (
              <CommonSelect key={i} label={item.label} options={item.options} value={item.value} onChange={item.onChange} multiple={item.multiple} limitTags={item.limitTags ?? 1} grid={item.grid} isLoading={item.isLoading} />
            ))}
            {children}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AdvancedSearch;
