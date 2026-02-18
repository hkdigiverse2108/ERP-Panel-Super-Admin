import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

const getValueByPath = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export const useDependentReset = <TValues extends Record<string, unknown>>(dependencies: { when: string; reset: string[] }[]) => {
  const { values, setFieldValue } = useFormikContext<TValues>();

  const prevValuesRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    dependencies.forEach(({ when, reset }) => {
      const prevValue = prevValuesRef.current[when];
      const currentValue = getValueByPath(values, when);

      if (prevValue !== undefined && prevValue !== currentValue) {
        reset.forEach((field) => setFieldValue(field, ""));
      }

      prevValuesRef.current[when] = currentValue;
    });
  }, [values, setFieldValue, dependencies]);
};
