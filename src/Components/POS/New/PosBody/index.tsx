import { Grid } from "@mui/material";
import PosFilter from "./PosFilter";
import PosSidebar from "./PosSidebar";
import PosFooter from "./PosFooter";
import PosTable from "./PosTable";

const PosBody = () => {
  return (
    <Grid container>
      <Grid gap={1} size={{ xs: 12, lg: 9, xxl: 10 }} p={1} className="flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <PosFilter />
          <PosTable />
        </div>
        <PosFooter />
      </Grid>
      <Grid size={{ xs: 12, lg: 3, xxl: 2 }}>
        <PosSidebar />
      </Grid>
    </Grid>
  );
};

export default PosBody;
