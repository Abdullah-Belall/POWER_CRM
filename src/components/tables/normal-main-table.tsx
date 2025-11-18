"use client";

type Column = {
  id: string;
  label: string;
  render?: (row: any) => any;
  format?: (value: any) => any;
  align?: string;
  minWidth?: string;
};

export default function NormalMainTable({
  columns,
  data,
}: {
  columns: Column[];
  data: any[];
}) {

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const getCellContent = (row: any, col: Column) => {
    const value = getNestedValue(row, col.id);
    if (col.render) {
      return col.render(row);
    }
    if (col.format) {
      return col.format(value);
    }
    return value;
  };


    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="border-b border-gray-100 whitespace-nowrap dark:border-gray-800">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={`px-5 text-center py-4 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/[0.03]">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => {
                  const rowId = row.id || rowIndex;
                  return (
                    <tr key={rowId}>
                      {columns.map((col) => {
                        const cellContent = getCellContent(row, col);
                        return (
                          <td
                            key={col.id}
                            className={`px-5 text-center py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400`}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
}
