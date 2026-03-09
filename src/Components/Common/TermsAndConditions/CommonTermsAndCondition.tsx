import { Add, Clear, Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Queries } from "../../../Api";
import { CommonButton, CommonValidationTextField } from "../../../Attribute";
import { useAppSelector } from "../../../Store/hooks";
import { setSelectedTermIds, setTermsAndConditionFormModal, setTermsAndConditionSelectionModal } from "../../../Store/Slices/ModalSlice";
import type { CommonTermsAndConditionProps, TermsConditionBase } from "../../../Types";

const CommonTermsAndCondition = ({ selectedTermIds, onChange, companyId, isView }: CommonTermsAndConditionProps) => {
  const [allTerms, setAllTerms] = useState<TermsConditionBase[]>([]);

  const { data: termsConditionData } = Queries.useGetTermsCondition({ all: true, companyId: companyId || undefined }, { enabled: !!companyId });
  const { selectedTermIds: globalSelectedTermIds } = useAppSelector((state) => state.modal);

  const dispatch = useDispatch();
  const isDefaultFetched = useRef(false);

  useEffect(() => {
    if (globalSelectedTermIds.length > 0) {
      onChange(globalSelectedTermIds);
      dispatch(setSelectedTermIds([]));
    }
  }, [globalSelectedTermIds, onChange, dispatch]);

  useEffect(() => {
    if (!termsConditionData?.data) return;
    const response = termsConditionData.data;
    const all: TermsConditionBase[] = response.termsCondition_data ?? [];
    setAllTerms(all);

    if (!isView && !isDefaultFetched.current && selectedTermIds.length === 0) {
      const defaultIds = all.filter((t) => t.isDefault).map((t) => t._id);
      if (defaultIds.length > 0) {
        onChange(defaultIds);
        isDefaultFetched.current = true;
      }
    }
  }, [termsConditionData, isView, onChange, selectedTermIds.length]);

  // Reset default fetch flag if company changes
  useEffect(() => {
    isDefaultFetched.current = false;
  }, [companyId]);

  const displayTerms = allTerms.filter((term) => selectedTermIds.includes(term._id)).sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  const handleDeleteTerm = (id: string) => {
    onChange(selectedTermIds.filter((termId: string) => termId !== id));
  };

  const handleOpenAddTerm = () => {
    dispatch(setTermsAndConditionFormModal({ open: true, data: null, companyId }));
  };

  const handleEditSingleTerm = (term: TermsConditionBase) => {
    dispatch(setTermsAndConditionFormModal({ open: true, data: term, companyId }));
  };

  const handleOpenSelectModal = () => {
    dispatch(setTermsAndConditionSelectionModal({ open: true, alreadySelectedIds: selectedTermIds, companyId }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
        {/* <Box fontWeight={600}>Terms & Conditions</Box> */}

        <Box display="flex" gap={1}>
          <CommonButton type="button" size="small" startIcon={<Add />} onClick={handleOpenAddTerm} variant="outlined" title="Add New" disabled={isView} />
          <CommonButton type="button" size="small" onClick={handleOpenSelectModal} variant="outlined" title="Select Terms" disabled={isView}>
            <Edit fontSize="small" /> Select Terms
          </CommonButton>
        </Box>
      </Box>

      {/* TABLE */}
      <Box sx={{ minWidth: "max-content" }}>
        <table className="w-full text-sm  border border-gray-200 dark:border-gray-700  ">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-2 w-10">#</th>
              <th className="p-2 text-left">Terms & Condition</th>
              <th className="p-2 w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayTerms?.map((term: TermsConditionBase, index: number) => (
              <tr key={term._id} className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-dark border-b border-gray-100 dark:border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{term.termsCondition}</td>
                <td className="p-2 text-center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <CommonButton size="small" color="primary" variant="text" onClick={() => handleEditSingleTerm(term)}>
                      <Edit fontSize="small" />
                    </CommonButton>
                    <CommonButton size="small" color="error" variant="text" onClick={() => handleDeleteTerm(term._id)}>
                      <Clear fontSize="small" />
                    </CommonButton>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {/* NOTE */}
      <Box mt={3}>
        <CommonValidationTextField name="notes" label="Note" multiline rows={4} placeholder="Enter a note (max 200 characters)" />
      </Box>
    </Box>
  );
};

export default CommonTermsAndCondition;
