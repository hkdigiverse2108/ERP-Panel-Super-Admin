import { CommonSelect, CommonValidationSelect } from "../../Attribute";
import type { ApiOption, DependentSelectProps } from "../../Types";
import { GenerateOptions } from "../../Utils";

export const DependentSelect = <T extends ApiOption, P = string | undefined>({ params, name, label, grid, required, disabled, enabled = true, query, value, onChange }: DependentSelectProps<T, P>) => {
  const { data, isLoading ,isFetching } = query(params, enabled);
  const options = GenerateOptions(data?.data);

  if (value && onChange) {
    return <CommonSelect label={label} disabled={disabled} isLoading={isLoading || isFetching} options={options} value={value} onChange={onChange} grid={grid} required={required} />;
  }

  return <CommonValidationSelect name={name} label={label} disabled={disabled} isLoading={isLoading || isFetching} options={options} grid={grid} required={required} />;
};
