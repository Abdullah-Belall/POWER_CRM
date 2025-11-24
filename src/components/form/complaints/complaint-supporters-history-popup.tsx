"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import { Avatar } from "@mui/material"
import { TfiFlag } from "react-icons/tfi";
import { diffHoursMinutes, formatDate } from "@/utils/base"
import { ComplaintSolvingInterface } from "@/types/interfaces/complaints-manager-interfaces"

export default function ComplaintSupportersHistoryPopup() {
  const popup = useAppSelector(selectPopup('viewComplaintSupportersHistoryPopup'))
  const dispatch = useAppDispatch()

  const handleClose = useCallback(() => {
    dispatch(closePopup({ popup: 'viewComplaintSupportersHistoryPopup' }))
  }, [])

  const [solving, setSolving] = useState<ComplaintSolvingInterface[]>([])

  useEffect(() => {
    if (popup.data?.solving) {
      const sorted = [...popup.data.solving].sort((a, b) => b.index - a.index)
      setSolving(sorted)
    }
  }, [popup.data])

  return popup.isOpen ? (
    <BlackLayer onClick={handleClose}>
      <div className="w-md h-fit border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Complaint Supporters History
            </h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute top-6 bottom-10 left-5 w-px bg-gray-200 dark:bg-gray-800" />

              {solving.map((e, i) => {
                const endDate = i === 0 ? popup.data?.end_solve_at ? formatDate(popup.data?.end_solve_at) : 'NOW' : formatDate(solving[i - 1].created_at)

                return (
                  <div key={e.id} className="relative mb-6 flex">
                    <div className="z-10 flex-shrink-0">
                      <Avatar src={''} alt={e?.supporter?.user_name || ''} />
                    </div>

                    <div className="ml-4">
                      {i === 0 && (
                        <div className="mb-1 flex items-center gap-1">
                          <TfiFlag style={{ textShadow: '0px 0px 7px #12b76a' }} className="text-success-500" />
                          <p
                            style={{ textShadow: '0px 0px 7px #12b76a' }}
                            className="text-theme-xs text-success-500 font-medium"
                          >
                            {popup.data?.end_solve_at ? 'Last' : 'Current'} Supporter
                          </p>
                        </div>
                      )}

                      <div className="flex items-baseline">
                        <h3 className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                          {e?.supporter?.user_name}
                        </h3>
                        <span className="text-theme-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                          | {e?.supporter?.index}
                        </span>
                      </div>

                      <p className="text-theme-sm font-normal text-gray-500 dark:text-gray-400">
                      {diffHoursMinutes(e.created_at, 
                        i === 0 ? popup.data?.end_solve_at ? popup.data?.end_solve_at : new Date() : solving[i - 1].created_at
                      )}
                      </p>

                      <div className="flex gap-2">
                        <p className="text-theme-xs mt-1 text-gray-400">
                          {formatDate(e?.created_at)}
                        </p>
                        <p className="text-theme-xs mt-1 text-gray-400">-</p>
                        <p className="text-theme-xs mt-1 text-gray-400">
                          {endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </div>
    </BlackLayer>
  ) : ""
}
