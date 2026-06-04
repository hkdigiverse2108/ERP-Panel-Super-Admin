import { Box, Grid, Typography } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { Mutations, Queries } from "../../../Api";
import { CommonBreadcrumbs, CommonCard, CommonTable, CommonBottomActionBar } from "../../../Components/Common";
import { CommonButton, CommonValidationSelect, CommonValidationTextField, CommonValidationSwitch } from "../../../Attribute";
import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { GenerateOptions } from "../../../Utils";
import { StockTransferFormSchema } from "../../../Utils/ValidationSchemas";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import type { CommonTableColumn } from "../../../Types";

const StockTransferForm = () => {
  const { id: urlId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const updateData = location.state?.data;
  const id = urlId || updateData?._id;

  const { data: stockTransferData } = Queries.useGetSingleStockTransfer(id);
  const { mutate: addStockTransfer, isPending: isAddLoading } = Mutations.useAddStockTransfer();
  const { mutate: editStockTransfer, isPending: isEditLoading } = Mutations.useEditStockTransfer();

  const { data: companyData, isLoading: companyLoading } = Queries.useGetCompanyDropdown();

  const initialValues = useMemo(() => {
    const data = updateData || stockTransferData?.data;
    return {
      companyId: typeof data?.companyId === "object" ? data.companyId?._id : data?.companyId || "",
      branchId: typeof data?.branchId === "object" ? data.branchId?._id : data?.branchId || "",
      requestedToBranchId: typeof data?.requestedToBranchId === "object" ? data.requestedToBranchId?._id : data?.requestedToBranchId || "",
      requestNote: data?.requestNote || "",
      isActive: data?.isActive !== undefined ? data.isActive : true,
      items: (data?.items || [{ productId: "", variantId: null, requestedQty: 0, price: 0, qty: 0 }]).map((item: any) => ({
        ...item,
        qty: item.productId?.qty || 0,
        productId: item?.variantId ? item.variantId : typeof item.productId === "object" ? item.productId._id : item.productId,
        variantId: item?.variantId ? (typeof item.productId === "object" ? item.productId._id : item.productId) : null,
      })),
    };
  }, [stockTransferData, updateData]);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      items: values.items.map((item: any) => ({
        productId: item?.variantId ? item.variantId : typeof item.productId === "object" ? item.productId._id : item.productId,
        variantId: item?.variantId ? (typeof item.productId === "object" ? item.productId._id : item.productId) : null,
        requestedQty: Number(item.requestedQty),
        price: Number(item.price),
      })),
    };

    if (id) {
      editStockTransfer({ stockTransferId: id, ...payload }, { onSuccess: () => navigate(ROUTES.STOCK_TRANSFER.BASE) });
    } else {
      addStockTransfer(payload, { onSuccess: () => navigate(ROUTES.STOCK_TRANSFER.BASE) });
    }
  };

  const emptyRow = { productId: "", variantId: null, requestedQty: 0, price: 0, qty: 0 };

  return (
    <>
      <CommonBreadcrumbs title={id ? PAGE_TITLE.INVENTORY.STOCK_TRANSFER.EDIT : PAGE_TITLE.INVENTORY.STOCK_TRANSFER.ADD} breadcrumbs={id ? BREADCRUMBS.STOCK_TRANSFER.EDIT : BREADCRUMBS.STOCK_TRANSFER.ADD} />
      <Box sx={{ p: { xs: 2, md: 3 }, mb: 8 }}>
        <Formik initialValues={initialValues} validationSchema={StockTransferFormSchema} onSubmit={handleSubmit} enableReinitialize validateOnMount>
          {({ values, setFieldValue, dirty }) => {
            const { data: fromBranchData, isLoading: fromBranchLoading } = Queries.useGetBranchDropdown({ companyFilter: values.companyId }, !!values.companyId);
            const { data: toBranchData, isLoading: toBranchLoading } = Queries.useGetBranchDropdown({ companyFilter: values.companyId }, !!values.companyId);
            const { data: productsData, isLoading: productsLoading } = Queries.useGetProductDropdown({ branchFilter: values.requestedToBranchId }, !!values.requestedToBranchId);

            return (
              <Form noValidate>
                <Grid container spacing={2}>
                  <Box sx={{ display: "grid", gap: 3, width: "100%" }}>
                    <CommonCard title="Stock Transfer Details">
                      <Grid container spacing={2} sx={{ p: 2 }}>
                        <CommonValidationSelect
                          name="companyId"
                          label="Select Company"
                          options={GenerateOptions(companyData?.data)}
                          isLoading={companyLoading}
                          required
                          grid={{ xs: 12, sm: 6, md: 4 }}
                          onChange={() => {
                            setFieldValue("branchId", "");
                            setFieldValue("requestedToBranchId", "");
                          }}
                        />
                        <CommonValidationSelect name="branchId" label="From Branch" options={GenerateOptions(fromBranchData?.data)} isLoading={fromBranchLoading} required disabled={!values.companyId} grid={{ xs: 12, sm: 6, md: 4 }} />
                        <CommonValidationSelect name="requestedToBranchId" label="To Branch" options={GenerateOptions(toBranchData?.data)} isLoading={toBranchLoading} required disabled={!values.companyId} grid={{ xs: 12, sm: 6, md: 4 }} onChange={() => setFieldValue("items", [emptyRow])} />
                        <CommonValidationTextField name="requestNote" label="Request Note" placeholder="Enter request note" grid={{ xs: 12, sm: 6, md: 8 }} />
                        <CommonValidationSwitch name="isActive" label="Is Active" grid={{ xs: 12, sm: 6, md: 4 }} />
                      </Grid>
                    </CommonCard>

                    <CommonCard title="Items">
                      <Box className="custom-scrollbar" sx={{ overflowX: "auto" }}>
                        <FieldArray name="items">
                          {({ push, remove }) => {
                            const columns: CommonTableColumn<any>[] = [
                              {
                                key: "actions",
                                header: "Actions",
                                bodyClass: "p-2 text-center flex gap-2 justify-center",
                                render: (_, index) => (
                                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                    {index === values.items.length - 1 && (
                                      <CommonButton size="small" variant="outlined" onClick={() => push(emptyRow)} disabled={!values.requestedToBranchId}>
                                        <AddIcon fontSize="small" />
                                      </CommonButton>
                                    )}
                                    {values.items.length > 1 && (
                                      <CommonButton size="small" color="error" variant="outlined" onClick={() => remove(index)}>
                                        <ClearIcon fontSize="small" />
                                      </CommonButton>
                                    )}
                                  </Box>
                                ),
                              },
                              { key: "sr", header: "#", bodyClass: "text-center", render: (_, i) => i + 1 },
                              {
                                key: "productId",
                                header: "Product",
                                render: (_, index) => (
                                  <CommonValidationSelect
                                    name={`items.${index}.productId`}
                                    syncName={`items.${index}.variantId`}
                                    label="Select Product"
                                    options={GenerateOptions(productsData?.data)}
                                    isLoading={productsLoading}
                                    required
                                    disabled={!values.requestedToBranchId}
                                    onChange={(val) => {
                                      const product = productsData?.data.find((p: any) => p._id === val[0]);
                                      if (product) {
                                        setFieldValue(`items.${index}.price`, product.landingCost || 0);
                                        setFieldValue(`items.${index}.qty`, product.qty || 0);
                                      }
                                    }}
                                  />
                                ),
                                bodyClass: "w-80",
                              },
                              {
                                key: "qty",
                                header: "Avail. Qty",
                                render: (_, index) => (
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {values.items[index]?.qty || 0}
                                  </Typography>
                                ),
                                bodyClass: "w-30",
                              },
                              {
                                key: "requestedQty",
                                header: "Requested Qty",
                                render: (_, index) => <CommonValidationTextField name={`items.${index}.requestedQty`} type="number" size="small" required maxDigits={5} />,
                                bodyClass: "w-80",
                              },
                              {
                                key: "price",
                                header: "Price",
                                render: (_, index) => <CommonValidationTextField name={`items.${index}.price`} type="number" size="small" required maxDigits={5} />,
                                bodyClass: "w-80",
                              },
                            ];

                            return <CommonTable data={values.items} columns={columns} rowKey={(_r, i) => i.toString()} />;
                          }}
                        </FieldArray>
                      </Box>
                    </CommonCard>
                  </Box>

                  <CommonBottomActionBar save={true} isLoading={isAddLoading || isEditLoading} disabled={!dirty} />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default StockTransferForm;
