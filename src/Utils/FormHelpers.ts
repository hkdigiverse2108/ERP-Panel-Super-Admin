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

export const GetChangedFields = (newVal: Record<string, any>, oldVal: Record<string, any> = {}): Record<string, any> => {
  const changed: Record<string, any> = {};

  const isEmpty = (v: any) => v === "" || v === null || v === undefined;

  Object.keys(newVal).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal[key];

    // ✅ Object (not array)
    if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
      const nestedChanged = GetChangedFields(newValue, oldValue ?? {});

      // 🔥 Any change → send full object
      if (Object.keys(nestedChanged).length > 0) {
        changed[key] = newValue;
      }

      return;
    }

    // ❌ both empty
    if (isEmpty(newValue) && isEmpty(oldValue)) return;

    // ✅ primitive / array changed
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
