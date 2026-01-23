import type { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import type { UseDataGridOptions } from "../../Types";
import { CleanParams } from "..";
import { useDebounce } from "./useDebounce";

export const useDataGrid = ({ page = 0, pageSize = 10, initialSort = [], initialFilter = { items: [] }, active = true, debounceDelay = 0, pagination = true }: UseDataGridOptions = {}) => {
  /* ---------------- Pagination ---------------- */
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page, pageSize });

  /* ---------------- Sorting ---------------- */
  const [sortModel, setSortModel] = useState<GridSortModel>(initialSort);

  /* ---------------- Sorting ---------------- */
  const [isActive, setActive] = useState<boolean>(true);

  /* ---------------- Filtering ---------------- */
  const [filterModel, setFilterModel] = useState<GridFilterModel>(initialFilter);

  const debouncedSearchTerm = useDebounce(filterModel.quickFilterValues?.[0], debounceDelay);

  /* ---------------- Advanced Filtering ---------------- */
  const [advancedFilter, setAdvancedFilter] = useState<Record<string, string[]>>({});

  const normalizeFilterValue = (value?: string[]) => {
    if (!value || value.length === 0) return undefined;
    return value.length === 1 ? value[0] : value;
  };

  const normalizedAdvancedFilter = Object.fromEntries(Object.entries(advancedFilter).map(([key, value]) => [key, normalizeFilterValue(value)]));

  const updateAdvancedFilter = (key: string, value: string[]) => setAdvancedFilter((prev) => ({ ...prev, [key]: value }));

  /* ---------------- Delete ---------------- */
  const [rowToDelete, setRowToDelete] = useState<{ _id?: string; title?: string } | null>(null);

  /* ---------------- API Params ---------------- */
  const params = useMemo(() => {
    return CleanParams({
      ...(pagination && {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      }),
      ...(active && { activeFilter: isActive }),
      ...normalizedAdvancedFilter,
      // Quick search
      search: debouncedSearchTerm,
    });
  }, [paginationModel, debouncedSearchTerm, isActive, normalizedAdvancedFilter, active, pagination]);

  /* ---------------- Reset ---------------- */
  const resetModels = useCallback(() => {
    setPaginationModel({ page, pageSize });
    setSortModel(initialSort);
    setFilterModel(initialFilter);
  }, [page, pageSize, initialSort, initialFilter]);

  return {
    paginationModel,
    setPaginationModel,

    sortModel,
    setSortModel,

    filterModel,
    setFilterModel,

    rowToDelete,
    setRowToDelete,

    isActive,
    setActive,

    advancedFilter,
    updateAdvancedFilter,

    params,
    resetModels,
  };
};
