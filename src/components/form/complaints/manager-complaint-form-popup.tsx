"use client"
import { useAppSelector } from "@/store/hooks/selector"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import BlackLayer from "../black-layer"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { MdOutlineClose  } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react"
import Input from "../input/InputField"
import { ScreenViewerEnum } from "@/types/enums/complaints-enums"
import { handleData } from "@/utils/base"
import TextArea from "../input/TextArea"
import Select from "../Select"
import Image from "next/image"
import { RiUploadCloud2Line } from "react-icons/ri";
import { getPageTrans } from "@/store/slices/language-slice"
import { handleUpload } from "@/utils/requests/client-reqs/cloudinary-reqs"
import { CLIENT_COLLECTOR_REQ, CREATE_COMPLAINT, GET_USERS } from "@/utils/requests/client-reqs/common-reqs"
import { UserInterface } from "@/types/interfaces/common-interfaces"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import dayjs, { Dayjs } from "dayjs";
import { MANAGER_COMPLAINTS_REQ } from "@/utils/requests/client-reqs/managers-reqs"
import { fillTable } from "@/store/slices/tables-slice"
import { selectCurrentUser } from "@/store/slices/user-slice"
import { CLIENT_COMPLAINTS } from "@/utils/requests/client-reqs/clients-reqs"

export default function ManagerComplaintFormPopup() {
  const currUser = useAppSelector(selectCurrentUser())
  const popup = useAppSelector(selectPopup('managerComplaintFormPopup'))
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => dispatch(closePopup({
    popup: 'managerComplaintFormPopup'
  })),[])
  const isForClient = currUser?.role?.roles?.includes('create-complaint')
  const [data, setData] = useState({
    client_id: isForClient ? currUser?.id: '',
    full_name: "",
    phone: "+20",
    title: "",
    details: "",
    screen_viewer: ScreenViewerEnum.ANYDESK,
    screen_viewer_id: "",
    screen_viewer_password: "",
    server_viewer: "",
    server_viewer_id: "",
    server_viewer_password: "",
    intervention_date: null,
    image1: "",
    image2: "",
  });
  const [imgLoading, setImgLoading] = useState(false)
  const imgEle = useRef<any>(null);
  const imgEle2 = useRef<any>(null);
  const trans = useAppSelector(getPageTrans("managersComplaintsPage")).popup;
  const [clients,setClients] = useState<UserInterface[]>([])
  useEffect(() => {
    if(isForClient) {
      handleData(setData, 'client_id', currUser?.id)
    }
  }, [currUser])
  useEffect(() => {
    const fetchClients = async () => {
      const res = await CLIENT_COLLECTOR_REQ(GET_USERS, {
        roleAttributes: JSON.stringify(["create-complaint"]),
      });
      if (res.done) {
        setClients(res.data?.users)
      }
    };
    fetchClients();
  }, []);
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };
  const vaildation = () => {
    const {
      client_id,
      full_name,
      phone,
      title,
      details,
      screen_viewer,
      screen_viewer_id,
      screen_viewer_password,
      server_viewer,
      server_viewer_id,
      server_viewer_password,
      intervention_date,
    } = data;
    console.log(client_id);
    if (
      !client_id ||
      client_id?.length === 0
    ) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Select client for the complaint");
      return false;
    }
    if (full_name.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Name must be more than 3 character");
      return false;
    }
    if (phone.trim().length !== 13) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Invaild phone number");
      return false;
    }
    if (title.trim().length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Title must be more than 3 character");
      return false;
    }
    if (details.trim().length < 15) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Details must be more than 14 character");
      return false;
    }
    if (screen_viewer_id.trim().length < 9) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Screen Viewer id must be more than 8 character");
      return false;
    }
    if (
      screen_viewer !== ScreenViewerEnum.ANYDESK &&
      (screen_viewer_password.trim().length < 5 || screen_viewer_password.trim().length > 9)
    ) {
      handleOpenSnakeBar(
        SnakeBarTypeEnum.ERROR,
        "Screen Viewer Password length must be between 4 and 8 character"
      );
      return false;
    }
    if (server_viewer) {
      if (server_viewer_id.trim().length < 9) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "Server Viewer id must be more than 8 character"
        );
        return false;
      }
      if (
        server_viewer !== ScreenViewerEnum.ANYDESK &&
        (server_viewer_password.trim().length < 5 || server_viewer_password.trim().length > 9)
      ) {
        handleOpenSnakeBar(
          SnakeBarTypeEnum.ERROR,
          "Server Viewer Password length must be between 4 and 8 character"
        );
        return false;
      }
    }
    if (!server_viewer && (server_viewer_id !== "" || server_viewer_password !== "")) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select server viewer");
      return false;
    }
    // if (intervention_date && !time) {
    //   handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention time");
    //   return false;
    // }
    // if (!intervention_date && time) {
    //   handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Please select intervention date");
    //   return false;
    // }
    if (intervention_date) {
      const now = dayjs();

      if ((intervention_date as Dayjs).isBefore(now, "day")) {
        handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Intervention date cannot be in the past");
        return false;
      }

      // if (time && typeof time !== "string" && typeof time !== "number") {
      //   const combinedDateTime = (intervention_date as Dayjs)
      //     .hour(time.hour())
      //     .minute(time.minute())
      //     .second(0)
      //     .millisecond(0);

      //   const oneHourLater = now.add(1, "hour");
      //   if (combinedDateTime.isBefore(oneHourLater)) {
      //     handleOpenSnakeBar(
      //       SnakeBarTypeEnum.ERROR,
      //       "Intervention date and time must be at least 1 hour from now"
      //     );
      //     return false;
      //   }
      // }
    }
    return true;
  };
  const [isPending, setIsPending] = useState(false);
  const handleConfirm = async () => {
    if (isPending) return;
    if (!vaildation()) return;
    let image1 = "";
    let image2 = "";
    if (imgEle.current?.files?.[0]) {
      image1 = await handleUpload(
        { target: { files: [imgEle.current?.files[0]] } },
        "Complaints/saved"
      );
    }
    if (imgEle2.current?.files?.[0]) {
      image2 = await handleUpload(
        { target: { files: [imgEle2.current?.files[0]] } },
        "Complaints/saved"
      );
    }
    setIsPending(true);
    const res = await CLIENT_COLLECTOR_REQ(CREATE_COMPLAINT, {
      data: {
        ...data,
        image1: image1 === "" ? undefined : image1,
        image2: image2 === "" ? undefined : image2,
        server_viewer: (data.server_viewer as any) === "" ? undefined : data.server_viewer,
        server_viewer_id: data.server_viewer_id === "" ? undefined : data.server_viewer_id,
        server_viewer_password:
          data.server_viewer_password === "" ? undefined : data.server_viewer_password,
      },
    });
    setIsPending(false);
    if (res.done) {
      dispatch(closePopup({popup: 'managerComplaintFormPopup'}))
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Created complaint successfully");
      if(isForClient) {
        const refetchComplaints = await CLIENT_COLLECTOR_REQ(CLIENT_COMPLAINTS)
        if(res.done) {
          dispatch(fillTable({
            tableName:'clientComplaintsTable',
            obj: {
              data: refetchComplaints.data.complaints,
              total: refetchComplaints.data.total
            }
          }))
        }
      } else {
        const refetchComplaints = await CLIENT_COLLECTOR_REQ(MANAGER_COMPLAINTS_REQ)
        if(res.done) {
          dispatch(fillTable({
            tableName:'managerComplaintsTable',
            obj: {
              data: refetchComplaints.data.complaints,
              total: refetchComplaints.data.total
            }
          }))
        }
      }
      setData({
        client_id: isForClient ? currUser?.id : '',
        full_name: "",
        phone: "+20",
        title: "",
        details: "",
        screen_viewer: ScreenViewerEnum.ANYDESK,
        screen_viewer_id: "",
        screen_viewer_password: "",
        server_viewer: "",
        server_viewer_id: "",
        server_viewer_password: "",
        intervention_date: null,
        image1: "",
        image2: "",
      })
    } else {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message);
    }
  };
  return popup.isOpen ? (<BlackLayer onClick={handleClose}>
    <div className="w-lg h-fit rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
      Create Complaint {isForClient ? "" : 'For Client'}
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
          {isForClient ? "" : 
          <Select options={clients.map((e) => ({value: e.id, label: e.index+ ' | ' + e.user_name}))} placeholder="Select Client" value={data.client_id || ''} onChange={(e) => handleData(setData, 'client_id', e.target.value)} />
          }
          </div>
          <div>
            <Input placeholder="Complainant" value={data.full_name} onChange={(e) => handleData(setData, 'full_name', e.target.value)} />
          </div>
          <div>
            <Input name={'Complainant Phone'} placeholder="Complainant Phone" value={data.phone} onChange={(e) => handleData(setData, 'phone', e.target.value)} />
          </div>
          <div className="col-span-full">
            <Input placeholder="Complaint Subject" value={data.title} onChange={(e) => handleData(setData, 'title', e.target.value)} />
          </div>
          <div className="col-span-full">
            <TextArea
              placeholder="Complaint Details"
              value={data.details}
              onChange={(e) => handleData(setData, 'details', e.target.value)}
              rows={4}
              />
          </div>
          <div className="relative">
            <Select options={[{
              value: ScreenViewerEnum.ANYDESK,
              label: ScreenViewerEnum.ANYDESK
            },
            {
              value: ScreenViewerEnum.TEAMVIEWR,
              label: ScreenViewerEnum.TEAMVIEWR
            },
            {
              value: ScreenViewerEnum.ULTRAVIEWER,
              label: ScreenViewerEnum.ULTRAVIEWER
            }
            ]} placeholder="Screen Share" value={data.screen_viewer} onChange={(e) => handleData(setData, 'screen_viewer', e.target.value)} />
          </div>
          <div>
            <Input placeholder='Share ID' value={data.screen_viewer_id} onChange={(e) => handleData(setData, 'screen_viewer_id', e.target.value)} />
          </div>
          <div className="relative">
            <Select options={[{
              value: '',
              label: 'Clear'
            },{
              value: ScreenViewerEnum.ANYDESK,
              label: ScreenViewerEnum.ANYDESK
            },
            {
              value: ScreenViewerEnum.TEAMVIEWR,
              label: ScreenViewerEnum.TEAMVIEWR
            },
            {
              value: ScreenViewerEnum.ULTRAVIEWER,
              label: ScreenViewerEnum.ULTRAVIEWER
            }
            ]} placeholder="Server Share" value={data.server_viewer} onChange={(e) => handleData(setData, 'server_viewer', e.target.value)} />
          </div>
          <div>
            <Input placeholder='Share ID' value={data.server_viewer_id} onChange={(e) => handleData(setData, 'server_viewer_id', e.target.value)} />
          </div>
          <div className="mt-2 col-span-full">
            <div className="w-full mx-auto flex gap-2">
            <label
              htmlFor="dropzone-file"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer text-gray-700 dark:text-gray-400 hover:border-brand-500 dark:hover:border-brand-500 bg-gray-50 dark:bg-gray-900 duration-200 transition-colors"
            >
              <Image
                className={data.image1 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data.image1}`}
                alt="Post Image"
              />
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  data.image1 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{trans.inputs.img[0]}</span> {trans.inputs.img[1]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                ref={imgEle}
                onChange={async (e) => {
                  if (imgLoading) return;
                  setImgLoading(true);
                  const saved = await handleUpload(e, "Complaints/temporary");
                  handleData(setData,"image1", saved);
                  setImgLoading(false);
                }}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </label>
            <label
              htmlFor="dropzone-file222"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer text-gray-700 dark:text-gray-400 hover:border-brand-500 dark:hover:border-brand-500 bg-gray-50 dark:bg-gray-900 duration-200 transition-colors"
            >
              <Image
                className={data.image2 === "" ? "hidden" : ""}
                fill
                src={`https://res.cloudinary.com/doy0la086/image/upload/${data.image2}`}
                alt="Post Image"
              />
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  data.image2 === "" ? "" : "hidden"
                }`}
              >
                <RiUploadCloud2Line className="text-4xl mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{trans.inputs.img[0]}</span> {trans.inputs.img[1]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                ref={imgEle2}
                onChange={async (e) => {
                  if (imgLoading) return;
                  setImgLoading(true);
                  const saved = await handleUpload(e, "Complaints/temporary");
                  handleData(setData,"image2", saved);
                  setImgLoading(false);
                }}
                id="dropzone-file222"
                type="file"
                className="hidden"
              />
            </label>
            </div>
          </div>
          <div className="col-span-full flex justify-center">
            <button onClick={handleConfirm} className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

    </BlackLayer>) : ""
}