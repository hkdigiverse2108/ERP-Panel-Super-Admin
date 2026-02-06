import { Box } from "@mui/material";
import type { FC } from "react";
import CommonTable from "../../../Components/Common/CommonTable";

interface TaxDetailsTableProps {
    items: any[];
}

const TaxDetailsTable: FC<TaxDetailsTableProps> = ({ items }) => {
    // Group items by tax rate
    const taxSummary = items.reduce((acc: any, item: any) => {
        const rate = Number(item.tax) || 0;
        const amount = (Number(item.qty) || 0) * (Number(item.landingCost) || 0); // Item total
        const taxAmount = amount * (rate / 100);

        if (!acc[rate]) {
            acc[rate] = {
                rate: rate,
                taxableAmount: 0,
                taxAmount: 0,
            };
        }
        acc[rate].taxableAmount += amount;
        acc[rate].taxAmount += taxAmount;
        return acc;
    }, {});

    const tableData = Object.values(taxSummary).sort((a: any, b: any) => b.rate - a.rate);

    const columns = [
        {
            key: "rate",
            header: "Result",
            render: (row: any) => (
                <Box>
                    <Box fontWeight={600}>Tax {row.rate}%</Box>
                    <Box fontSize="12px" color="text.secondary">
                        (Tax Rate)
                    </Box>
                </Box>
            ),
        },
        {
            key: "rateVal",
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
            <CommonTable data={tableData} columns={columns} rowKey={(row: any) => row.rate.toString()} />
        </Box>
    );
};

export default TaxDetailsTable;
