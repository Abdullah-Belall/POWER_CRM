"use client";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { handleData } from "@/utils/base";
import {
  styled,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import BlackLayer from "../black-layer";
import Button from "@/components/ui/button/Button";
import { UPLOAD_EXCEL_REQ } from "@/utils/requests/server-reqs/complaints-manager-reqs";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const VALID_EXCEL_EXTENSIONS = [".xlsx", ".xls", ".xlsm", ".xlsb"];

export default function UploadExcelFilePopup() {
  const [data, setData] = useState<{
    file: File | null;
  }>({
    file: null,
  });
  const uploadExcelFile = useAppSelector(selectPopup("uploadExcelFile"));
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Reset form when popup closes
  useEffect(() => {
    if (!uploadExcelFile.isOpen) {
      setData({ file: null });
      setLoading(false);
    }
  }, [uploadExcelFile.isOpen]);

  const handleClose = useCallback(() => {
    dispatch(closePopup({
      popup: 'uploadExcelFile',
    }));
  }, [dispatch]);

  const handleOpenSnakeBar = useCallback((type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  }, [dispatch]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
      if (!VALID_EXCEL_EXTENSIONS.includes(fileExtension)) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "الرجاء اختيار ملف Excel فقط (.xlsx, .xls, .xlsm, .xlsb)"
        );
        // Reset input
        event.target.value = '';
        return;
      }
    }
    handleData(setData, "file", file);
  }, [handleOpenSnakeBar]);

  const handleSubmit = async () => {
    if (loading) return;
    
    if (!data.file) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "الرجاء اختيار ملف");
      return;
    }

    const fileExtension = data.file.name.toLowerCase().substring(data.file.name.lastIndexOf("."));
    if (!VALID_EXCEL_EXTENSIONS.includes(fileExtension)) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "الرجاء اختيار ملف Excel فقط (.xlsx, .xls, .xlsm, .xlsb)"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", data.file);
    setLoading(true);
    
      // const endPoint = uploadExcelFile.data?.endPoint || 'potential-customers';
      console.log('feee ayyyy');
      const res = await UPLOAD_EXCEL_REQ({ data: formData, endPoint: 'potential-customers' })
      console.log(res);
      if (res.done) {
        if (uploadExcelFile.data?.onDone) {
          await uploadExcelFile.data.onDone();
        }
        handleClose();
        handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "تم رفع الملف واستيراد البيانات بنجاح");
      } else {
        handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "حدث خطأ أثناء رفع الملف");
      }
      setLoading(false);
  };

  if (!uploadExcelFile.isOpen) return null;

  return (
    <BlackLayer onClick={handleClose}>
      <div 
        className="w-full max-w-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-lg shadow-theme-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              رفع ملف Excel
            </h3>
            <button 
              onClick={handleClose} 
              className="text-xl bg-brand-500 hover:bg-brand-600 rounded-full text-white w-[30px] h-[30px] flex justify-center items-center transition-colors"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="w-full">
            <Button
              variant="outline"
              className="!w-full !justify-start !gap-3"
              startIcon={<IoMdCloudUpload className="text-gray-700 dark:text-gray-300" />}
              onClick={() => document.getElementById('excel-file-input')?.click()}
            >
              {data.file ? data.file.name : "اختر ملف Excel"}
            </Button>
            <VisuallyHiddenInput
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls,.xlsm,.xlsb,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            {data.file && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                الملف المختار: {data.file.name} ({(data.file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !data.file}
            className="!w-full"
          >
            {loading ? "جاري الرفع..." : "رفع واستيراد البيانات"}
          </Button>
        </div>
      </div>
    </BlackLayer>
  );
}
