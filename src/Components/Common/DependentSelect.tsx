import { CommonValidationSelect } from "../../Attribute";
import type { ApiOption, DependentSelectProps } from "../../Types";
import { GenerateOptions } from "../../Utils";

export const DependentSelect = <T extends ApiOption, P = string | undefined>({ params, name, label, grid, required, disabled, enabled = true, query }: DependentSelectProps<T, P>) => {
  const { data, isLoading } = query(params, enabled);

  return <CommonValidationSelect name={name} label={label} disabled={disabled} isLoading={isLoading} options={GenerateOptions(data?.data)} grid={grid} required={required} />;
};
