"use client";

import { useMemo, useState } from "react";

type Column = {
  id: string;
  label: string;
  render?: (row: any) => any;
  format?: (value: any) => any;
  align?: string;
  minWidth?: string;
  showCheckbox?: boolean;
  hideSearch?: boolean,
  hideSort?: boolean,
};

export default function MainTable({
  columns,
  data,
}: {
  columns: Column[];
  data: any[];
}) {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) => {
      return columns.some((col) => {
        const value = getNestedValue(row, col.id);
        return String(value || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    });
  }, [data, search, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row.id || String(row))));
    }
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

  const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, filteredData.length);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400">Show</span>
            <div className="relative z-20 bg-transparent">
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value={10} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  10
                </option>
                <option value={8} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  8
                </option>
                <option value={5} className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  5
                </option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400 pointer-events-none">
                <svg
                  className="stroke-current"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">entries</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400 pointer-events-none">
                <svg
                  className="fill-current"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                    fill=""
                  />
                </svg>
              </button>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                type="text"
              />
            </div>
            <button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300">
              Download
              <svg
                className="fill-current"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0018 14.083C9.7866 14.083 9.59255 13.9924 9.45578 13.8472L5.61586 10.0097C5.32288 9.71688 5.32272 9.242 5.61552 8.94902C5.90832 8.65603 6.3832 8.65588 6.67618 8.94868L9.25182 11.5227L9.25182 3.33301C9.25182 2.91879 9.5876 2.58301 10.0018 2.58301C10.416 2.58301 10.7518 2.91879 10.7518 3.33301L10.7518 11.5193L13.3242 8.94866C13.6172 8.65587 14.0921 8.65604 14.3849 8.94903C14.6777 9.24203 14.6775 9.7169 14.3845 10.0097L10.5761 13.8154C10.4385 13.979 10.2323 14.083 10.0018 14.083ZM4.0835 13.333C4.0835 12.9188 3.74771 12.583 3.3335 12.583C2.91928 12.583 2.5835 12.9188 2.5835 13.333V15.1663C2.5835 16.409 3.59086 17.4163 4.8335 17.4163H15.1676C16.4102 17.4163 17.4176 16.409 17.4176 15.1663V13.333C17.4176 12.9188 17.0818 12.583 16.6676 12.583C16.2533 12.583 15.9176 12.9188 15.9176 13.333V15.1663C15.9176 15.5806 15.5818 15.9163 15.1676 15.9163H4.8335C4.41928 15.9163 4.0835 15.5806 4.0835 15.1663V13.333Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full min-w-0 overflow-auto custom-scrollbar">
          <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                <tr>
                  {columns.map((col, colIndex) => {
                    const isStickyActionsColumn =
                      colIndex === columns.length - 1 &&
                      String(col.label || col.id).toLowerCase() === "actions";

                    return (
                      <th
                        key={col.id}
                        className={`px-4 py-3 border border-gray-100 dark:border-white/[0.05] ${
                          isStickyActionsColumn
                            ? "sticky right-0 bg-white dark:bg-gray-900 z-20"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col w-full items-center gap-1">
                          <div className="flex items-center justify-between cursor-pointer">
                            <div className={`${col.minWidth} flex gap-3`}>
                              {col.showCheckbox && (
                                <label className="flex items-center space-x-3 group cursor-pointer">
                                  <div className="relative w-5 h-5">
                                    <input
                                      checked={
                                        paginatedData.length > 0 &&
                                        paginatedData.every(
                                          (row) =>
                                            selectedRows.has(row.id || String(row))
                                        )
                                      }
                                      onChange={handleSelectAll}
                                      className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
                                      type="checkbox"
                                    />
                                  </div>
                                </label>
                              )}
                              <span className="font-medium text-nowrap text-gray-700 text-theme-xs dark:text-gray-400">
                                {col.label}
                              </span>
                            </div>
                            {
                              !col.hideSort ? <button className="flex flex-col gap-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={8}
                                height={5}
                                fill="none"
                                className="text-gray-300 dark:text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M4.41.585a.5.5 0 0 0-.82 0L1.05 4.213A.5.5 0 0 0 1.46 5h5.08a.5.5 0 0 0 .41-.787z"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={8}
                                height={5}
                                fill="none"
                                className="text-gray-300 dark:text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M4.41 4.415a.5.5 0 0 1-.82 0L1.05.787A.5.5 0 0 1 1.46 0h5.08a.5.5 0 0 1 .41.787z"
                                />
                              </svg>
                            </button>: ""
                            }
                          </div>
                          {col.hideSearch ? null : (
                            <input
                              placeholder="Search..."
                              className="text-xs placeholder:text-xs dark:bg-dark-900 w-full min-w-[40px] max-w-[100px] rounded-lg border border-gray-300 bg-transparent p-1 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/[0.05]"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => {
                    const rowId = row.id || String(row) || rowIndex;
                    const isSelected = selectedRows.has(String(rowId));
                    const firstCol = columns[0];

                    return (
                      <tr key={rowId}>
                        {columns.map((col, colIndex) => {
                          const isFirstCol = colIndex === 0;
                          const showCheckbox = isFirstCol && firstCol?.showCheckbox;
                          const isStickyActionsColumn =
                            colIndex === columns.length - 1 &&
                            String(col.label || col.id).toLowerCase() === "actions";

                          return (
                            <td
                              key={col.id}
                              className={`px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap ${
                                isStickyActionsColumn
                                  ? "sticky right-0 bg-white dark:bg-gray-900"
                                  : ""
                              }`}
                            >
                              {showCheckbox ? (
                                <div className="flex gap-3">
                                  <div className="mt-1">
                                    <label className="flex items-center space-x-3 group cursor-pointer">
                                      <div className="relative w-5 h-5">
                                        <input
                                          checked={isSelected}
                                          onChange={() =>
                                            handleSelectRow(String(rowId))
                                          }
                                          className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
                                          type="checkbox"
                                        />
                                      </div>
                                    </label>
                                  </div>
                                  <div>{getCellContent(row, col)}</div>
                                </div>
                              ) : (
                                <div className="w-full flex justify-center">{getCellContent(row, col)}</div>
                              )}
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

        {/* Pagination Footer */}
        <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            <div className="pb-3 xl:pb-0">
              <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                {filteredData.length === 0
                  ? "No entries"
                  : `Showing ${startEntry} to ${endEntry} of ${filteredData.length} entries`}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 ${
                        currentPage === page
                          ? "bg-brand-500 text-white"
                          : "text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
