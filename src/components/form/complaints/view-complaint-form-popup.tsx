'use client'
import Image from "next/image";
import BlackLayer from "../black-layer";
import { MdOutlineClose } from "react-icons/md";
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { useCallback } from "react";
import TextArea from "../input/TextArea";
import { RiUploadCloud2Line } from "react-icons/ri";
import { getPageTrans } from "@/store/slices/language-slice";
import Input from "../input/InputField";

export default function ViewComplaintFormPopup() {
  const popup = useAppSelector(selectPopup('viewComplaintFormPopup'))
  const data = popup.data
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'viewComplaintFormPopup'
  })),[])
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).popup;
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-lg h-fit rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      View Complaint
    </h3>
      <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
        <MdOutlineClose />
      </button>
    </div>
    </div>
  <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-70px)] overflow-y-scroll custom-scrollbar">
    <div className="space-y-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {data?.client? (<div>
              <Input disabled={true} placeholder="Complainant" value={data?.client?.index + ' | ' + data?.client?.user_name} />
          </div>): ''}
          <div>
              <Input disabled={true} placeholder="Complainant" value={data?.full_name} />
          </div>
          <div>
            <Input disabled={true} name={'Complainant Phone'} placeholder="Complainant Phone" value={data?.phone} />
          </div>
          <div className="col-span-full">
            <Input disabled={true} placeholder="Complaint Subject" value={data?.title}/>
          </div>
          <div className="col-span-full">
              <TextArea
              disabled={true}
              placeholder="Complaint Details"
              value={data?.details}
              rows={4}
              />
          </div>
          <div className="relative">
            <Input disabled={true} value={data?.screen_viewer} />
          </div>
          <div>
            <Input disabled={true} placeholder='Share ID' value={data?.screen_viewer_id} />
          </div>
          <div className="relative">
            <Input disabled={true} placeholder="Server Viewer" value={data?.server_viewer} />
          </div>
          <div>
            <Input disabled={true} placeholder='Share ID' value={data?.server_viewer_id} />
          </div>
          <div className="mt-2 col-span-full">
            <div className="w-full mx-auto flex gap-2">
            <label
              htmlFor="dropzone-file"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer text-gray-700 dark:text-gray-400 hover:border-brand-500 dark:hover:border-brand-500 bg-gray-50 dark:bg-gray-900 duration-200 transition-colors"
            >
              {!data?.image1 || data?.image1 === '' ? "" : <Image
                className={data?.image1 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data?.image1}`}
                alt="Post Image"
              />}
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  !data?.image1 || data?.image1 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{trans.inputs.img[0]}</span> {trans.inputs.img[1]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                disabled={true}
              />
            </label>
            <label
              htmlFor="dropzone-file222"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer text-gray-700 dark:text-gray-400 hover:border-brand-500 dark:hover:border-brand-500 bg-gray-50 dark:bg-gray-900 duration-200 transition-colors"
            >
              {!data?.image2 || data?.image2 === '' ? "" : <Image
                className={data?.image2 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data?.image2}`}
                alt="Post Image"
              />}
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  !data?.image2 || data?.image2 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{trans.inputs.img[0]}</span> {trans.inputs.img[1]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                id="dropzone-file222"
                type="file"
                className="hidden"
                disabled={true}
              />
            </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}