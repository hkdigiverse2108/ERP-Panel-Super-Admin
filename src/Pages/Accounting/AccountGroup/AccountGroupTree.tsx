// import { Box } from "@mui/material";
// import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
// import { PAGE_TITLE } from "../../../Constants";
// import { BREADCRUMBS } from "../../../Data";
// import "zingchart/es6";
// import ZingChart from "zingchart-react";
// import "zingchart/modules-es6/zingchart-tree.min.js";

// const AccountGroupTree = () => {
//   const treeConfig = {
//     type: "tree",
//     options: {
//       aspect: "tree-right",
//       layout: "tree-right",
//       node: {
//         type: "circle",
//         label: {
//           visible: true,
//           fontSize: 12,
//         },
//         hoverState: {
//           visible: false,
//         },
//       },
//       connectors: [
//         {
//           type: "step",
//           lineStyle: "solid",
//           lineColor: "#666",
//           lineWidth: 2,
//         },
//       ],
//     },
//     series: [
//       { type: "node", id: "primary", parent: "", name: "Primary" },
//       { type: "node", id: "current-assets", parent: "primary", name: "Current Assets" },
//       { type: "node", id: "bank-account", parent: "current-assets", name: "Bank Account" },
//       { type: "node", id: "cash-in-hand", parent: "current-assets", name: "Cash in Hand" },
//       { type: "node", id: "stock-in-hand", parent: "current-assets", name: "Stock in Hand" },
//       { type: "node", id: "sundry-debtors", parent: "current-assets", name: "Sundry Debtors" },
//       { type: "node", id: "current-liabilities", parent: "primary", name: "Current Liabilities" },
//       { type: "node", id: "duties-taxes", parent: "current-liabilities", name: "Duties & Taxes" },
//       { type: "node", id: "tds", parent: "duties-taxes", name: "TDS" },
//       { type: "node", id: "tcs", parent: "duties-taxes", name: "TCS" },
//       { type: "node", id: "salary-payable", parent: "current-liabilities", name: "Salary Payable" },
//     ],
//   };

//   return (
//     <>
//       <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT_GROUP.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT_GROUP.BASE} />
//       <Box sx={{ p: { xs: 2, md: 3 }, display: "grid" }}>
//         <CommonCard hideDivider>
//           <ZingChart data={treeConfig} height="600px" />
//         </CommonCard>
//       </Box>
//     </>
//   );
// };

// export default AccountGroupTree;

import { Box } from "@mui/material";
import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";

import ReactFlow, { Background, Controls, Position } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const nodes: Node[] = [
  // Root
  {
    id: "primary",
    data: { label: "Primary" },
    position: { x: 0, y: 200 },
    sourcePosition: Position.Right,
  },

  // Level 1
  {
    id: "current-assets",
    data: { label: "Current Assets" },
    position: { x: 250, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "current-liabilities",
    data: { label: "Current Liabilities" },
    position: { x: 250, y: 300 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },

  // Level 2 - Assets
  { id: "bank", data: { label: "Bank Account" }, position: { x: 550, y: 0 }, targetPosition: Position.Left },
  { id: "cash", data: { label: "Cash in Hand" }, position: { x: 550, y: 80 }, targetPosition: Position.Left },
  { id: "stock", data: { label: "Stock in Hand" }, position: { x: 550, y: 160 }, targetPosition: Position.Left },
  { id: "debtors", data: { label: "Sundry Debtors" }, position: { x: 550, y: 240 }, targetPosition: Position.Left },

  // Level 2 - Liabilities
  { id: "duties", data: { label: "Duties & Taxes" }, position: { x: 550, y: 320 }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "salary", data: { label: "Salary Payable" }, position: { x: 550, y: 400 }, targetPosition: Position.Left },

  // Level 3
  { id: "tds", data: { label: "TDS" }, position: { x: 800, y: 300 }, targetPosition: Position.Left },
  { id: "tcs", data: { label: "TCS" }, position: { x: 800, y: 360 }, targetPosition: Position.Left },
];

const edges: Edge[] = [
  { id: "e1", source: "primary", target: "current-assets", type: "smoothstep" },
  { id: "e2", source: "primary", target: "current-liabilities", type: "smoothstep" },

  { id: "e3", source: "current-assets", target: "bank", type: "smoothstep" },
  { id: "e4", source: "current-assets", target: "cash", type: "smoothstep" },
  { id: "e5", source: "current-assets", target: "stock", type: "smoothstep" },
  { id: "e6", source: "current-assets", target: "debtors", type: "smoothstep" },

  { id: "e7", source: "current-liabilities", target: "duties", type: "smoothstep" },
  { id: "e8", source: "current-liabilities", target: "salary", type: "smoothstep" },

  { id: "e9", source: "duties", target: "tds", type: "smoothstep" },
  { id: "e10", source: "duties", target: "tcs", type: "smoothstep" },
];

const AccountGroupTree = () => {
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT_GROUP.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.ACCOUNT_GROUP.BASE} />

      <Box sx={{ p: 3 }}>
        <CommonCard hideDivider>
          <Box sx={{ height: 600 }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background />
              <Controls />
            </ReactFlow>
          </Box>
        </CommonCard>
      </Box>
    </>
  );
};

export default AccountGroupTree;


