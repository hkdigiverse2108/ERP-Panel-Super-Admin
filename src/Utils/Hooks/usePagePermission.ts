import { useAppSelector } from "../../Store/hooks";

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

export const usePagePermission = (pageName: string) => {
  const { permission } = useAppSelector((state) => state.layout);

  const pageKey = normalize(pageName);

  const result = {
    view: false,
    add: false,
    edit: false,
    delete: false,
    isAllowed: false,
  };

  permission?.forEach((parent) => {
    const parentKey = normalize(parent?.tabName || "");

    // 🔹 Parent level
    if (parentKey === pageKey) {
      result.view = !!parent.view;
      result.add = !!parent.add;
      result.edit = !!parent.edit;
      result.delete = !!parent.delete;

      // 🔥 FIX
      result.isAllowed = result.view || result.add || result.edit;
    }

    // 🔹 Child level (ONLY if parent view)
    if (parent.view && parent.children?.length) {
      parent.children?.forEach((child) => {
        const childKey = normalize(child?.tabName || "");

        if (childKey === pageKey) {
          result.view = !!child.view;
          result.add = !!child.add;
          result.edit = !!child.edit;
          result.delete = !!child.delete;

          // 🔥 FIX
          result.isAllowed = result.view || result.add || result.edit;
        }
      });
    }
  });

  return result;
};
