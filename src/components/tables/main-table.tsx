"use client";

import { useEffect, useMemo, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import BlackLayer from "../form/black-layer";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";
import Select from "../form/Select";

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
export type MenuActionItem = {
  label: string;
  action: () => Promise<void>;
};

export type MenuGroup = {
  label: string;
  data: MenuActionItem[];
};
export default function MainTable({
  columns,
  data,
  list
}: {
  columns: Column[];
  data: any[];
  list?: MenuGroup
}) {
  const [search
  ] = useState("");
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
  
  const handleExportExcel = () => {
    const exportData = filteredData.map((row: any) => {
      const formattedRow: any = {};
      columns.forEach((col: Column) => {
        formattedRow[col.label] = getNestedValue(row, col.id);
      });
      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `exported-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("تقرير البيانات", 40, 40);

    const tableColumn = columns.map((col: Column) => col.label);
    const tableRows = filteredData.map((row: any) =>
      columns.map((col: Column) => {
        const value = getNestedValue(row, col.id);
        return value === null || value === undefined ? "" : String(value);
      })
    );

    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      styles: {
        font: "helvetica",
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [17, 91, 119],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`exported-data-${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  const [openMenu, setOpenMenu] = useState(false)
  const [filterSelect, setFilterSelect] = useState('')
  useEffect(() => {
    if(filterSelect !== '') {list?.data.find((e) => filterSelect === e.label)?.action()
      setCurrentPage(1)
    }
  }, [filterSelect])
  return (
    <>
    <div className="space-y-6">
      <div className="rounded-xl bg-white dark:bg-white/[0.03]">
        <div className="py-4 pl-[18px] pr-4 flex items-center justify-between">
          <div>
            {list ? 
              <Select options={list.data.map((e) => ({value: e.label, label: e.label}))} placeholder={list.label} value={filterSelect} onChange={(e) => setFilterSelect(e.target.value)} />
            : ""}
          </div>
          <div className="relative">
          <button 
            onClick={() => setOpenMenu(!openMenu)}
            className="text-black dark:text-white text-lg hover:opacity-70 transition-opacity"
          >
            <HiDotsVertical />
          </button>
          {openMenu && (
            <div className="z-[999999999] absolute right-0 bottom-0 translate-y-[100%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col w-[140px] rounded-xl shadow-theme-lg overflow-hidden">
              <button
                onClick={() => {
                  handleExportPDF();
                  setOpenMenu(false);
                }}
                className="p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium text-left transition-colors"
              >
                Export PDF <FaRegFilePdf />
              </button>
              <button
                onClick={() => {
                  handleExportExcel();
                  setOpenMenu(false);
                }}
                className="p-2 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium text-left transition-colors"
              >
                Export Excel <RiFileExcel2Line />
              </button>
            </div>
          )}
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
                          <div className="flex items-center gap-2 justify-between cursor-pointer">
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
    {openMenu ? <BlackLayer transparent onClick={() => setOpenMenu(false)}><></></BlackLayer> : ''}
    </>
  );
}
