export const RemoveEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (typeof value === "object" && !Array.isArray(value)) {
      const cleaned = RemoveEmptyFields(value);
      if (Object.keys(cleaned).length > 0) {
        result[key as keyof T] = cleaned as T[keyof T];
      }
      return;
    }

    result[key as keyof T] = value;
  });

  return result;
};

export const GetChangedFields = <T extends Record<string, any>>(newVal: T, oldVal?: Partial<T>): Partial<T> => {
  const changed: Partial<T> = {};

  (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal?.[key];

    if (newValue === undefined) return;

    if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
      const nested = GetChangedFields(newValue as Record<string, any>, (oldValue as Record<string, any>) ?? {});

      if (Object.keys(nested).length > 0) {
        changed[key] = nested as T[keyof T];
      }
      return;
    }

    if (newValue !== oldValue) {
      changed[key] = newValue;
    }
  });

  return changed;
};

// export const GetChangedFields = <T extends Record<string, any>>(newVal: T, oldVal?: Partial<T>): Partial<T> => {
//   const changed: Partial<T> = {};

//   Object.keys(newVal).forEach((key) => {
//     const k = key as keyof T;
//     const newValue = newVal[k];
//     const oldValue = oldVal?.[k];

//     if (newValue === undefined) return;

//     if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
//       const nested = GetChangedFields(newValue, (oldValue ?? {}) as Record<string, any>);

//       if (Object.keys(nested).length > 0) {
//         changed[k] = nested as T[keyof T];
//       }
//       return;
//     }

//     if (newValue !== oldValue) {
//       changed[k] = newValue;
//     }
//   });

//   return changed;
// };
