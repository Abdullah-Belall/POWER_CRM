"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useState } from "react"
import {  handleData } from "@/utils/base"
import Select from "../Select"
import { CLIENT_COLLECTOR_REQ, GET_USERS } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { CREATE_DISCUSSION } from "@/utils/requests/client-reqs/sales-reqs"
import { useRouter } from "next/navigation"
import { DiscussionStatusEnum } from "@/types/enums/discussion-status-enums"
import TextArea from "../input/TextArea"
import Checkbox from "../input/Checkbox"
import { MeetingEnum } from "@/types/enums/meeting-enums"
import Input from "../input/InputField"
import MultiSelect from "../MultiSelect"
import { UserInterface } from "@/types/interfaces/common-interfaces"
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CustomerDisussionFormPopup() {
  const router = useRouter()
  const popup = useAppSelector(selectPopup('discussionFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'discussionFormPopup'
  })),[])
  const [data, setData] = useState({
    details: "",
    status: DiscussionStatusEnum.NORMAL,
    meeting: '',
    meeting_url: '',
    meeting_date: null,
  });
  const [loading, setLoading] = useState(false);
  const [meeting, setMeeting] = useState(false)
  const [employees,setEmployees] = useState<UserInterface[]>([])
  const [selectedEmployees,setSelectedEmployees] = useState<UserInterface[]>([])
  const [time, setTime] = useState<PickerValue | null>(null);
  const fetchemployees = async () => {
    if (employees.length > 0) return;
    const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
      roleAttributes: JSON.stringify(["suitable_for_meeting"]),
    });
    if (res.done) {
      setEmployees(res.data.users);
    }
  };
  useEffect(() => {
    fetchemployees();
  }, []);
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(openSnakeBar({
      type,
      message
    }))
  }
  const validation = () => {
    const {meeting_date} = data
    if (meeting_date && !time) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention time");
      return false;
    }
    if (!meeting_date && time) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention date");
      return false;
    }
    if (meeting_date) {
      const now = dayjs();

      if ((meeting_date as Dayjs).isBefore(now, "day")) {
        handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Intervention date cannot be in the past");
        return false;
      }

      if (time && typeof time !== "string" && typeof time !== "number") {
        const combinedDateTime = (meeting_date as Dayjs)
          .hour(time.hour())
          .minute(time.minute())
          .second(0)
          .millisecond(0);

        const oneHourLater = now.add(1, "hour");
        if (combinedDateTime.isBefore(oneHourLater)) {
          handleOpenSnakeBar(
            SnakeBarTypeEnum.ERROR,
            "Intervention date and time must be at least 1 hour from now"
          );
          return false;
        }
      }
    }
    return true
  }
  const handleConfirm: any = async () => {
    if (loading) return;
    if(!validation()) return;
    setLoading(true);
    const res = await CLIENT_COLLECTOR_REQ(CREATE_DISCUSSION, {
      data: { ...data, customer_id: popup.data?.customer_id,
        meeting_employees: JSON.stringify(selectedEmployees.map((e) => e.id)),
        },
    });
    setLoading(false);
    if (res.done) {
      handleClose()
      dispatch(
        openSnakeBar({
          message: "Successfully added discussion",
          type: SnakeBarTypeEnum.SUCCESS,
        })
      );
      router.push(window.location.pathname + `?forRefresh=${Math.random()}`)
    } else {
      dispatch(
        openSnakeBar({
          message: res?.message,
          type: SnakeBarTypeEnum.ERROR,
        })
      );
    }
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
      <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Add New Discussion
            </h3>
            <button onClick={handleClose} className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center">
              <MdOutlineClose />
            </button>
          </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar">
        <div className="space-y-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-full">
              <TextArea
                placeholder="Discussion Details"
                value={data.details}
                onChange={(e) => handleData(setData, 'details', e.target.value)}
                rows={4}
              />
          </div>
              <div className="col-span-full">
                <Select options={[
                  {
                    value: DiscussionStatusEnum.GOOD,
                    label: DiscussionStatusEnum.GOOD,
                  },
                  {
                    value: DiscussionStatusEnum.NORMAL,
                    label: DiscussionStatusEnum.NORMAL,
                  },
                  {
                    value: DiscussionStatusEnum.BAD,
                    label: DiscussionStatusEnum.BAD,
                  },
                ]} placeholder="Status" value={data.status} onChange={(e) => handleData(setData, 'status', e.target.value)} />
              </div>
              <div className="col-span-full flex flex-col gap-2">
                <div className="flex gap-2">
                  <Checkbox checked={meeting} onChange={() => {
                    handleData(setData, 'meeting' , '')
                    setTime(null)
                    setSelectedEmployees([])
                    setMeeting(!meeting)
                  }} />
                  <h1 className="text-black dark:text-white">Schedule a Meeting</h1>
                </div>
                {
                  meeting ?
                  <Select options={[
                    {
                      value: '',
                      label: 'Clear',
                    },
                    {
                      value: MeetingEnum.ZOOM,
                      label: MeetingEnum.ZOOM,
                    },
                    {
                      value: MeetingEnum.GOOGLE,
                      label: MeetingEnum.GOOGLE,
                    },
                    {
                      value: MeetingEnum.ON_SITE,
                      label: MeetingEnum.ON_SITE,
                    },
                    {
                      value: MeetingEnum.AT_COMPANY,
                      label: MeetingEnum.AT_COMPANY,
                    },
                    {
                      value: MeetingEnum.NEXT_FOLLOW_UP,
                      label: MeetingEnum.NEXT_FOLLOW_UP,
                    },
                  ]} placeholder="Meeting" value={data.meeting} onChange={(e) => handleData(setData, 'meeting', e.target.value)} />
                  : ''
                }
              </div>
              {
                data.meeting !== '' ?
                <>
                  <div className="col-span-full">
                    <Input
                      placeholder={'Meeting URL'}
                      value={data?.meeting_url}
                      onChange={(e) => handleData(setData, 'meeting_url' , e.target.value)}
                    />
                  </div>
                  <div className="col-span-full">
                    <div
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/40"
                      dir="ltr"
                    >
                      <div className="mb-4 flex flex-col gap-1 text-center sm:text-left">
                        <h1 className="text-sm font-medium text-gray-800 dark:text-white/90">
                          Meeting Date & Time
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pick the date and time that suits both you and the customer.
                        </p>
                      </div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="grid gap-3 md:grid-cols-2">
                          <DatePicker
                            className="w-full"
                            onChange={(newValue) => handleData(setData,"meeting_date", newValue as any)}
                            value={data.meeting_date as any}
                            minDate={dayjs()}
                            slotProps={{
                              textField: {
                                className: "crm-picker",
                                placeholder: "Select date",
                              },
                              popper: {
                                sx: { zIndex: 99999999999 },
                              },
                            }}
                          />
                          <TimePicker
                            className="w-full"
                            value={time}
                            onChange={(newValue) => setTime(newValue)}
                            slotProps={{
                              textField: {
                                className: "crm-picker",
                                placeholder: "Select time",
                              },
                              popper: {
                                sx: { zIndex: 99999999999 },
                              },
                            }}
                          />
                        </div>
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-span-full">
                <MultiSelect 
                  options={employees.map((user: any) => ({
                    value: String(user.id), 
                    text: user.index + ' | ' + user.user_name, 
                    selected: user.selected
                  }))} 
                  label="Select Employees" 
                  onChange={(selectedIds) => {
                    const selected = employees.filter((user: any) => 
                      selectedIds.includes(String(user.id))
                    );
                    setSelectedEmployees(selected);
                  }}
                />
              </div>
                </>
                : ""
              }

              <div className="col-span-full flex justify-center">
                <button onClick={handleConfirm} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                  Confirm
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </BlackLayer>) : ""
}