import { Box } from "@mui/material";
import type { Edge, Node } from "reactflow";
import ReactFlow, { Background, Controls, MiniMap, Position } from "reactflow";
import "reactflow/dist/style.css";

import { Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import type { AccountGroupTreeDataResponse } from "../../../Types";

/* -------------------- Layout constants -------------------- */
const NODE_HEIGHT = 40;
const NODE_GAP_Y = 40;
const LEVEL_GAP_X = 280;

/* -------------------- Types -------------------- */
type FlowResult = {
  nodes: Node[];
  edges: Edge[];
};

/* -------------------- Calculate subtree height -------------------- */
const getSubtreeHeight = (node: AccountGroupTreeDataResponse): number => {
  if (!node.children || node.children.length === 0) {
    return NODE_HEIGHT;
  }

  return node.children.reduce((sum, child) => sum + getSubtreeHeight(child), 0) + (node.children.length - 1) * NODE_GAP_Y;
};

/* -------------------- Build CENTERED tree -------------------- */
const buildCenteredTree = (data: AccountGroupTreeDataResponse[], level = 0, parentId?: string, startY = 0): FlowResult => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let currentY = startY;

  data.forEach((item) => {
    const subtreeHeight = getSubtreeHeight(item);

    // Parent is vertically centered in its subtree
    const nodeY = currentY + subtreeHeight / 2 - NODE_HEIGHT / 2;

    nodes.push({
      id: item._id,
      data: { label: item.name },
      position: {
        x: level * LEVEL_GAP_X,
        y: nodeY,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${item._id}`,
        source: parentId,
        target: item._id,
        type: "smoothstep",
        animated: true,
      });
    }

    if (item.children?.length) {
      const childFlow = buildCenteredTree(item.children, level + 1, item._id, currentY);

      nodes.push(...childFlow.nodes);
      edges.push(...childFlow.edges);
    }

    currentY += subtreeHeight + NODE_GAP_Y;
  });

  return { nodes, edges };
};

/* -------------------- Page Component -------------------- */
const AccountGroupTree = () => {
  const { data, isLoading } = Queries.useGetAccountGroupTree();

  if (isLoading) return null;

  const treeData: AccountGroupTreeDataResponse[] = data?.data ?? [];

  const { nodes, edges } = buildCenteredTree(treeData);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.ACCOUNT_GROUP.TREE} maxItems={3} breadcrumbs={BREADCRUMBS.ACCOUNT_GROUP.TREE} />

      <Box sx={{ p: 3 }}>
        <CommonCard hideDivider>
          <Box sx={{ height: 600 }}>
            <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.2 }}>
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </Box>
        </CommonCard>
      </Box>
    </>
  );
};

export default AccountGroupTree;
