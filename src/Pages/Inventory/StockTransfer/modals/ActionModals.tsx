import { Box, Typography } from "@mui/material";
import { Form, Formik, FieldArray } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { Mutations } from "../../../../Api";
import { CommonModal, CommonTable } from "../../../../Components/Common";
import { CommonButton, CommonValidationTextField } from "../../../../Attribute";
import type { CommonTableColumn, StockTransferBase } from "../../../../Types";
import { ApproveStockTransferSchema, ConfirmReceiptStockTransferSchema, RejectStockTransferSchema } from "../../../../Utils";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  data: StockTransferBase;
  onSuccess: () => void;
}

export const ApproveModal = ({ open, onClose, data, onSuccess }: ActionModalProps) => {
  const { mutate: approveMutate, isPending } = Mutations.useApproveStockTransfer();

  const initialValues = {
    stockTransferId: data._id || "",
    approvalNote: "",
    items: data.items.map((item) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      requestedQty: item.requestedQty,
      approvedQty: item.requestedQty,
      price: item.price,
    })),
  };

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      items: values.items.map(({ productId, approvedQty, price }: any) => ({
        productId,
        approvedQty,
        price,
      })),
    };
    approveMutate(payload, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  return (
    <CommonModal isOpen={open} onClose={onClose} title="Approve Stock Transfer" className="max-w-4xl">
      <Formik initialValues={initialValues} validationSchema={ApproveStockTransferSchema} onSubmit={handleSubmit}>
        {({ isValid, values }) => (
          <Form>
            <Box sx={{ display: "grid", gap: 2, p: 2 }}>
              <CommonValidationTextField name="approvalNote" label="Approval Note" multiline rows={2} />
              <div className="overflow-x-auto">
                <FieldArray name="items">
                  {(arrayHelpers) => (
                    <CommonTable
                      data={values.items}
                      columns={[
                        {
                          key: "actions",
                          header: "Actions",
                          bodyClass: "p-2 text-center",
                          render: (_, index) => (
                            <CommonButton size="small" color="error" variant="outlined" onClick={() => arrayHelpers.remove(index)} disabled={values.items.length <= 1}>
                              <ClearIcon fontSize="small" />
                            </CommonButton>
                          ),
                        },
                        { key: "sr", header: "#", render: (_, i) => i + 1 },
                        { key: "productName", header: "Product", bodyClass: "w-80 overflow-hidden text-ellipsis whitespace-nowrap" },
                        { key: "requestedQty", header: "Req Qty", bodyClass: "text-center" },
                        {
                          key: "approvedQty",
                          header: "Approved Qty",
                          render: (_, index) => <CommonValidationTextField name={`items.${index}.approvedQty`} type="number" size="small" required />,
                        },
                        {
                          key: "price",
                          header: "Price",
                          render: (_, index) => <CommonValidationTextField name={`items.${index}.price`} type="number" size="small" required />,
                        },
                      ]}
                      rowKey={(_r, i) => i.toString()}
                    />
                  )}
                </FieldArray>
              </div>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <CommonButton onClick={onClose} variant="outlined" title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Approve" loading={isPending} disabled={!isValid} />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export const RejectModal = ({ open, onClose, data, onSuccess }: ActionModalProps) => {
  const { mutate: rejectMutate, isPending } = Mutations.useRejectStockTransfer();

  const handleSubmit = (values: any) => {
    rejectMutate(
      { stockTransferId: data._id || "", ...values },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <CommonModal isOpen={open} onClose={onClose} title="Reject Stock Transfer" className="max-w-lg">
      <Formik initialValues={{ approvalNote: "" }} validationSchema={RejectStockTransferSchema} onSubmit={handleSubmit}>
        {({ isValid }) => (
          <Form>
            <Box sx={{ display: "grid", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Are you sure you want to reject this stock transfer? Please provide a reason.
              </Typography>
              <CommonValidationTextField name="approvalNote" label="Rejection Reason" multiline rows={3} required />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <CommonButton onClick={onClose} variant="outlined" title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Reject" loading={isPending} disabled={!isValid} />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};

export const ConfirmReceiptModal = ({ open, onClose, data, onSuccess }: ActionModalProps) => {
  const { mutate: confirmMutate, isPending } = Mutations.useConfirmReceiptStockTransfer();

  const initialValues = {
    stockTransferId: data._id || "",
    receiptNote: "",
    items: data.items.map((item) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      approvedQty: item.approvedQty,
      receivedQty: item.approvedQty,
    })),
  };

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      items: values.items.map(({ productId, receivedQty }: any) => ({
        productId,
        receivedQty,
      })),
    };
    confirmMutate(payload, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  const columns: CommonTableColumn<any>[] = [
    { key: "sr", header: "#", render: (_, i) => i + 1 },
    { key: "productName", header: "Product", bodyClass: "w-80" },
    { key: "approvedQty", header: "Approved Qty", bodyClass: "text-center" },
    {
      key: "receivedQty",
      header: "Received Qty",
      render: (_, index) => <CommonValidationTextField name={`items.${index}.receivedQty`} type="number" size="small" required />,
    },
  ];

  return (
    <CommonModal isOpen={open} onClose={onClose} title="Confirm Stock Receipt" className="max-w-4xl">
      <Formik initialValues={initialValues} validationSchema={ConfirmReceiptStockTransferSchema} onSubmit={handleSubmit}>
        {({ isValid, values }) => (
          <Form>
            <Box sx={{ display: "grid", gap: 2, p: 2 }}>
              <CommonValidationTextField
                name="receiptNote"
                label="Receipt Note"
                multiline
                rows={2}
                required={values.items.some((item: any) => (item.receivedQty || 0) < (item.approvedQty || 0))}
              />
              <div className="overflow-x-auto">
                <CommonTable data={values.items} columns={columns} rowKey={(_r, i) => i.toString()} />
              </div>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <CommonButton onClick={onClose} variant="outlined" title="Cancel" />
                <CommonButton type="submit" variant="contained" title="Confirm Receipt" loading={isPending} disabled={!isValid} />
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </CommonModal>
  );
};
