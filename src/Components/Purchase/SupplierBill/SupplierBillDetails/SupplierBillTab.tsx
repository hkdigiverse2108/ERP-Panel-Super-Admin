import { Box, Tab, Tabs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { ClearIcon } from "@mui/x-date-pickers-pro";
import { CommonButton, CommonSelect, CommonTextField, CommonValidationTextField } from "../../../../Attribute";
import { CommonTabPanel, CommonCard } from "../../../Common";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { CommonTable } from "../../../Common";
import type { CommonTableColumn, TermsConditionBase } from "../../../../Types";
import type { ProductRow, SupplierBillTabsProps } from "../../../../Types/SupplierBill";
import { useDispatch } from "react-redux";
import { setTermsAndConditionModal, setTermsSelectionModal } from "../../../../Store/Slices/ModalSlice";

const SupplierBillTabs = ({ tabValue, setTabValue, rows, handleAdd, handleCut, handleRowChange, termsList, returnRows, handleAddReturn, handleCutReturn, handleReturnRowChange, productOptions, isProductLoading, returnRoundOffAmount, onReturnRoundOffAmountChange, handleDeleteTerm }: SupplierBillTabsProps) => {
  const dispatch = useDispatch();
  const ProductRowColumns: CommonTableColumn<ProductRow>[] = [
    {
      key: "actions",
      header: "",
      bodyClass: "p-2 flex justify-center gap-1",
      render: (_, index) => (
        <>
          {index === rows.length - 1 && (
            <CommonButton size="small" variant="outlined" onClick={handleAdd}>
              <AddIcon fontSize="small" />
            </CommonButton>
          )}
          {rows.length > 1 && (
            <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCut(index)}>
              <ClearIcon fontSize="small" />
            </CommonButton>
          )}
        </>
      ),
      footer: () => <span className="p-2 text-right block">Total</span>,
      footerClass: "text-right",
    },
    { key: "sr", header: "#", render: (_, i) => i + 1, footer: "" },
    { key: "productId", header: "Product", bodyClass: "min-w-60", render: (row, index) => <CommonSelect label="Search Product" value={row.productId ? [row.productId] : []} options={productOptions} isLoading={isProductLoading} onChange={(v) => handleRowChange(index, "productId", v)} required />, footer: "" },
    { key: "qty", header: "Qty", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.qty} onChange={(v) => handleRowChange(index, "qty", v)} />, footer: (data) => data.reduce((a, b) => a + (+b.qty || 0), 0) },
    { key: "freeQty", header: "Free Qty", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.freeQty} onChange={(v) => handleRowChange(index, "freeQty", v)} />, footer: (data) => data.reduce((a, b) => a + (+b.freeQty || 0), 0) },
    { key: "mrp", header: "MRP", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.mrp} onChange={(v) => handleRowChange(index, "mrp", v)} /> },
    { key: "unitCost", header: "Unit Cost", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.unitCost} onChange={(v) => handleRowChange(index, "unitCost", v)} /> },
    { key: "sellingPrice", header: "Selling", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.sellingPrice} onChange={(v) => handleRowChange(index, "sellingPrice", v)} /> },
    { key: "disc1", header: "Disc 1", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.disc1} onChange={(v) => handleRowChange(index, "disc1", v)} isCurrency currencyDisabled /> },
    { key: "disc2", header: "Disc 2", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.disc2} onChange={(v) => handleRowChange(index, "disc2", v)} isCurrency currencyDisabled /> },
    { key: "taxableAmount", header: "Taxable", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.taxableAmount} onChange={(v) => handleRowChange(index, "taxableAmount", v)} />, footer: (data) => data.reduce((a, b) => a + (+b.taxableAmount || 0), 0).toFixed(2) },
    {
      key: "tax",
      header: "Tax",
      bodyClass: "min-w-28 text-center",
      render: (row) => (
        <span>
          {row.taxName} {row.taxRate}% (₹{row.itemTax})
        </span>
      ),
      footer: (data) => data.reduce((a, b) => a + (+b.itemTax || 0), 0).toFixed(2),
    },
    { key: "landingCost", header: "Landing", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.landingCost} onChange={(v) => handleRowChange(index, "landingCost", v)} /> },
    { key: "margin", header: "Margin", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.margin} onChange={(v) => handleRowChange(index, "margin", v)} /> },
    {
      key: "totalAmount",
      header: "Total",
      bodyClass: "min-w-28",
      render: (row, index) => <CommonTextField type="number" value={row.totalAmount} onChange={(v) => handleRowChange(index, "totalAmount", v)} />,
      footer: (data) => data.reduce((a, b) => a + (+b.totalAmount || 0), 0).toFixed(2),
    },
  ];

  const TermsColumns: CommonTableColumn<TermsConditionBase>[] = [
    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10" },
    { key: "termsCondition", header: "Condition", headerClass: "text-left", bodyClass: "text-left w-80" },
    {
      key: "action",
      header: "Action",
      headerClass: "text-center w-20",
      bodyClass: "w-20 text-center",
      render: (row, index) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <CommonButton size="small" variant="outlined" onClick={() => dispatch(setTermsAndConditionModal({ open: true, data: row }))}>
            <EditIcon fontSize="small" />
          </CommonButton>
          <CommonButton size="small" color="error" variant="outlined" onClick={() => handleDeleteTerm(index)}>
            <GridDeleteIcon fontSize="small" />
          </CommonButton>
        </Box>
      ),
    },
  ];

  const ReturnRowColumns: CommonTableColumn<ProductRow>[] = [
    {
      key: "actions",
      header: "",
      bodyClass: "p-2 flex justify-center gap-1",
      render: (_, index) => (
        <>
          {index === returnRows.length - 1 && (
            <CommonButton size="small" variant="outlined" onClick={handleAddReturn}>
              <AddIcon />
            </CommonButton>
          )}
          {returnRows.length > 1 && (
            <CommonButton size="small" color="error" variant="outlined" onClick={() => handleCutReturn(index)}>
              <ClearIcon />
            </CommonButton>
          )}
        </>
      ),
      footer: () => <span className="p-2 text-right block">Total</span>,
      footerClass: "text-right",
    },
    { key: "sr", header: "#", render: (_, i) => i + 1, bodyClass: "w-10", footer: "" },
    { key: "productId", header: "Product Name", headerClass: "text-start", bodyClass: "min-w-60 w-60 text-start", render: (row, index) => <CommonSelect label="Search Product" value={row.productId ? [row.productId] : []} options={productOptions} isLoading={isProductLoading} onChange={(v) => handleReturnRowChange(index, "productId", v)} required />, footer: "" },
    { key: "qty", header: "Qty", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.qty} onChange={(v) => handleReturnRowChange(index, "qty", v)} />, footer: (data) => data.reduce((a, b) => a + (parseFloat(String(b.qty)) || 0), 0) },
    { key: "freeQty", header: "Free Qty", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.freeQty} onChange={(v) => handleReturnRowChange(index, "freeQty", v)} />, footer: (data) => data.reduce((a, b) => a + (+b.freeQty || 0), 0) },
    { key: "unitCost", header: "Unit Cost", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.unitCost} onChange={(v) => handleReturnRowChange(index, "unitCost", v)} /> },
    { key: "disc1", header: "Disc1", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.disc1} onChange={(v) => handleReturnRowChange(index, "disc1", v)} isCurrency currencyDisabled /> },
    { key: "disc2", header: "Disc2", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.disc2} onChange={(v) => handleReturnRowChange(index, "disc2", v)} isCurrency currencyDisabled /> },
    { key: "taxableAmount", header: "Taxable", bodyClass: "min-w-28", render: (row) => <CommonTextField type="number" value={row.taxableAmount} disabled /> },
    {
      key: "tax",
      header: "Tax",
      render: (row) => (
        <span>
          {row.taxName} {row.taxRate}% (₹{row.itemTax})
        </span>
      ),
    },
    { key: "landingCost", header: "Landing Cost", bodyClass: "min-w-28", render: (row, index) => <CommonTextField type="number" value={row.landingCost} onChange={(v) => handleReturnRowChange(index, "landingCost", v)} /> },
    { key: "totalAmount", header: "Total", bodyClass: "min-w-28", render: (row) => <CommonTextField type="number" value={row.totalAmount} disabled /> },
  ];
  return (
    <>
      {/* ================= TABS HEADER ================= */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Product Details" />
          <Tab label="Terms & Conditions" />
          <Tab label="Return Product Details" />
        </Tabs>
      </Box>

      {/* ================= TAB 1 : PRODUCT DETAILS ================= */}
      <CommonTabPanel value={tabValue} index={0}>
        <Box sx={{ mt: 2 }}>
          <CommonCard hideDivider>
            <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 1400 }}>
                <CommonTable data={rows} columns={ProductRowColumns} rowKey={(_: ProductRow, i: number) => String(i)} showFooter />
              </Box>
            </Box>
          </CommonCard>
        </Box>
      </CommonTabPanel>

      {/* ================= TAB 2 : TERMS ================= */}
      <CommonTabPanel value={tabValue} index={1}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <CommonCard
            hideDivider
            title="Terms & Conditions"
            topContent={
              <Box display="flex" gap={1}>
                <CommonButton startIcon={<AddIcon />} onClick={() => dispatch(setTermsAndConditionModal({ open: true, data: null }))}>
                  New Term
                </CommonButton>
                <CommonButton startIcon={<EditIcon />} onClick={() => dispatch(setTermsSelectionModal({ open: true, data: termsList.map((t: TermsConditionBase) => t._id) }))}>
                  Edit Terms
                </CommonButton>
              </Box>
            }
          >
            <Box p={2}>
              <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
                <CommonTable data={termsList} columns={TermsColumns} rowKey={(row: TermsConditionBase) => row._id || ""} />
              </Box>
            </Box>
          </CommonCard>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
            <Box sx={{ width: "100%", maxWidth: "1100px" }}>
              <CommonValidationTextField name="notes" label="Note" multiline rows={6} placeholder="Minimum 200 characters" />
            </Box>
          </Box>
        </Box>
      </CommonTabPanel>

      {/* ================= TAB 3 : RETURN PRODUCT ================= */}
      <CommonTabPanel value={tabValue} index={2}>
        <Box sx={{ mt: 2 }}>
          <CommonCard hideDivider>
            <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 1300 }}>
                <CommonTable data={returnRows} columns={ReturnRowColumns} rowKey={(_: ProductRow, i: number) => String(i)} showFooter />
              </Box>
            </Box>
          </CommonCard>
          {/* ================= SUMMARY BOX ================= */}
          <Box sx={{ mt: 3, mb: 2, mr: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 350px" }, gap: 2 }}>
            <Box />
            <CommonCard hideDivider>
              <Box p={2} className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                  <span>Gross</span>
                  <span>{returnRows.reduce((a: number, b: ProductRow) => a + (parseFloat(String(b.taxableAmount)) || 0), 0).toFixed(2)}</span>
                </Box>

                <Box className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                  <span>Tax Amount</span>
                  <span>{returnRows.reduce((a: number, b: ProductRow) => a + (parseFloat(String(b.itemTax)) || 0), 0).toFixed(2)}</span>
                </Box>

                <Box className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700 text-blue-600">
                  <span>Roundoff</span>
                  <Box width={100}>
                    <CommonTextField type="number" value={returnRoundOffAmount} onChange={onReturnRoundOffAmountChange} />
                  </Box>
                </Box>
                <Box className="flex justify-between p-3 text-lg font-semibold">
                  <span>Net Amount</span>
                  <span>{(returnRows.reduce((a: number, b: ProductRow) => a + (parseFloat(String(b.totalAmount)) || 0), 0) + (parseFloat(String(returnRoundOffAmount)) || 0)).toFixed(2)}</span>
                </Box>
              </Box>
            </CommonCard>
          </Box>
        </Box>
      </CommonTabPanel>
    </>
  );
};
export default SupplierBillTabs;
