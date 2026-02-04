import type { CommonTableProps } from "../../../Types";

const CommonTable = <T,>({ data, columns, rowKey, getRowClass, showFooter }: CommonTableProps<T>) => {
  const hasFooter = showFooter && columns.some((c) => c.footer);

  return (
    <table className="w-full text-sm">
      {/* ---------- HEADER ---------- */}
      <thead className="sticky top-0 z-10 bg-gray-100  dark:text-gray-200 text-gray-600 dark:bg-gray-900">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={`p-2 ${col.headerClass ?? "text-center"}`}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      {/* ---------- BODY ---------- */}
      <tbody>
        {data.map((row, i) => (
          <tr key={rowKey(row)} className={`text-gray-600 dark:text-gray-300 ${getRowClass?.(row, i)}`}>
            {columns.map((col) => (
              <td key={col.key} className={`p-2 text-center ${col.bodyClass}`}>
                {col.render ? col.render(row, i) : (row as Record<string, string | number>)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      {/* ---------- FOOTER ---------- */}
      {hasFooter && (
        <tfoot className="sticky bg-gray-100 dark:bg-gray-900 font-medium">
          <tr className="text-gray-600 dark:text-gray-200">
            {columns.map((col) => (
              <td key={col.key} className={`p-2 text-center ${col.footerClass ?? col.bodyClass}`}>
                {typeof col.footer === "function" ? col.footer(data) : (col.footer ?? "")}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default CommonTable;
