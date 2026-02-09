import { Box } from "@mui/material";
import type { FC } from "react";
import CommonTable from "../../../Components/Common/CommonTable";

interface TaxDetailsTableProps {
  items: any[];
  productData: any[];
  taxType?: string;
}

const TaxDetailsTable: FC<TaxDetailsTableProps> = ({ items, productData, taxType }) => {
  const tableData = items
    .map((item: any, index: number) => {
      const productId = item.productId;
      const product = productData.find((p: any) => p._id === productId);
      const productName = product ? (product.productName || product.name || product.title || "") : "";
      const rate = Number(item.tax) || 0;
      const qty = Number(item.qty) || 0;
      const unitCost = Number(item.unitCost) || 0;

      let taxAmount = 0;

      if (taxType === "tax_inclusive") {
        const totalCtx = qty * unitCost;
        taxAmount = totalCtx - (totalCtx / (1 + rate / 100));
      } else {
        taxAmount = (qty * unitCost) * (rate / 100);
      }

      return {
        id: index,
        productName,
        rate,
        taxAmount,
      };
    })
    .filter((row) => row.taxAmount > 0);
  const columns = [
    {
      key: "productName",
      header: "Product",
      render: (row: any) => <Box fontWeight={600}>{row.productName}</Box>,
    },
    {
      key: "rate",
      header: "Tax Rate",
      render: (row: any) => `${row.rate}%`,
    },
    {
      key: "taxAmount",
      header: "Tax Amount",
      render: (row: any) => row.taxAmount.toFixed(2),
    },
  ];

  return (
    <Box className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      <CommonTable data={tableData} columns={columns} rowKey={(row: any) => row.id.toString()} />
    </Box>
  );
};

export default TaxDetailsTable;
