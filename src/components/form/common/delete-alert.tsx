"use client"
import { useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, PopupState, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import Button from "@/components/ui/button/Button"


export default function DeleteAlertFormPopup({ popupName, onDone }: { popupName: keyof PopupState, onDone: () => Promise<void> }) {
  const popup = useAppSelector(selectPopup(popupName as any))
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  const handleClose = () =>
    dispatch(
      closePopup({
        popup: popupName as any,
      })
    )

  const handleSubmit = async () => {
    if (loading) return

    setLoading(true)
    await onDone()
    setLoading(false)
  }

  if (!popup.isOpen) {
    return null
  }

  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="w-sm border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Delete Alert</h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
          <div className="space-y-6 flex flex-col gap-2 items-center justify-center">
            <h1 className="text-black dark:text-white text-lg">Are you sure you want to delete this?</h1>
            <div className="flex gap-1">
              <Button onClick={handleSubmit}>Delete</Button>
              <Button variant='outline' onClick={handleClose}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </BlackLayer>
  )
}

