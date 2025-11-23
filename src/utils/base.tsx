import { ComplaintPriorityStatusEnum, ComplaintStatusEnum, ScreenViewerEnum } from "@/types/enums/complaints-enums";
import { ContractStatusEnum } from "@/types/enums/contract-status-enum";
import { DiscussionStatusEnum } from "@/types/enums/discussion-status-enums";
import { PotentialCustomerStatusEnum } from "@/types/enums/potential-customers-enums";
import { SiAnydesk, SiTeamviewer } from "react-icons/si";

export const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000") + "/api";
export const errMsg = "There is problem, please try again later.";

export const formatDate = (input: string | Date) => {
  let date: Date;

  if (typeof input === "string") {
    const fixedString = input.replace(" ", "T");
    date = new Date(fixedString);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    return "تاريخ غير صالح";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const hours = getPart("hour");
  const minutes = getPart("minute");
  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const ScreenViewer = ({ viewer }: { viewer: ScreenViewerEnum }) => {
  switch (viewer) {
    case ScreenViewerEnum.ANYDESK:
      return (
        <div className="flex gap-1.5 items-center text-nowrap">
          <SiAnydesk   className="text-lg text-[#f44034]" />
          <div className="!text-black font-[600]">Any Desk</div>
        </div>
      );

    case ScreenViewerEnum.TEAMVIEWR:
      return (
        <div className="flex gap-1.5 items-center !text-[#0b1157] text-nowrap">
          <SiTeamviewer className="text-lg" />
          <div className="font-[600]">Team Viewer</div>
        </div>
      );

    case ScreenViewerEnum.ULTRAVIEWER:
      return (
        <div className="flex gap-1.5 items-center !text-[#2675cc] text-nowrap ml-[-3px]">
          <img src="/ultraviewer.webp" alt="UltraViewer" className="w-[22px]" />
          <div className="font-[600]">Ultra Viewer</div>
        </div>
      );

    default:
      return null;
  }
};

export const complaintStatuses = [
  ComplaintStatusEnum.COMPLETED,
  ComplaintStatusEnum.CANCELLED,
  ComplaintStatusEnum.IN_PROGRESS,
  ComplaintStatusEnum.PENDING,
  ComplaintStatusEnum.CLIENT_CANCELLED,
  ComplaintStatusEnum.SUSPENDED,
];

export const StatusViewer = ({
  status,
}: {
  status: ContractStatusEnum | ComplaintStatusEnum | PotentialCustomerStatusEnum | DiscussionStatusEnum;
}) => {
  switch (status) {
    case ComplaintStatusEnum.COMPLETED:
    case PotentialCustomerStatusEnum.CONTRACTED:
    case ContractStatusEnum.SIGNED:
    case DiscussionStatusEnum.GOOD:
      return (
        <button className="p-1 text-xs text-nowrap bg-green-900 text-green-300 rounded-md border-2 border-green-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.CANCELLED:
    case PotentialCustomerStatusEnum.LOSTED:
    case ContractStatusEnum.DECLINED:
    case DiscussionStatusEnum.BAD:
      return (
        <button className="p-1 text-xs text-nowrap bg-indigo-900 text-indigo-300 rounded-md border-2 border-indigo-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.IN_PROGRESS:
    case PotentialCustomerStatusEnum.PRICE_DISCUSSIONS:
    case ContractStatusEnum.OFFERED:
    case DiscussionStatusEnum.NORMAL:
      return (
        <button className="p-1 text-xs text-nowrap bg-sky-900 text-sky-300 rounded-md border-2 border-sky-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.PENDING:
    case PotentialCustomerStatusEnum.PENDING:
    case ContractStatusEnum.PENDING:
      return (
        <button className="p-1 text-xs text-nowrap bg-orange-900 text-orange-300 rounded-md border-2 border-orange-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.CLIENT_CANCELLED:
    case PotentialCustomerStatusEnum.DISCUSSION:
    case ContractStatusEnum.ACCEPTED:
      return (
        <button className="p-1 text-xs text-nowrap bg-slate-900 text-slate-300 rounded-md border-2 border-slate-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.SUSPENDED:
      return (
        <button className="p-1 text-xs text-nowrap bg-red-900 text-red-300 rounded-md border-2 border-red-300">
          {status}
        </button>
      );
    case ComplaintStatusEnum.DEVELOPMENT:
      return (
        <button className="p-1 text-xs text-nowrap bg-stone-900 text-stone-300 rounded-md border-2 border-stone-300">
          {status}
        </button>
      );
    default:
      return null;
  }
};
export const ComplaintPriorityStatusViewer = ({
  status,
}: {
  status: ComplaintPriorityStatusEnum;
}) => {
  switch (status) {
    case ComplaintPriorityStatusEnum.HIGH:
      return (
        <button className="p-1 text-xs text-nowrap bg-purple-900 text-purple-300 rounded-md border-2 border-purple-300">
          {status}
        </button>
      );
    case ComplaintPriorityStatusEnum.NORMAL:
      return (
        <button className="p-1 text-xs text-nowrap bg-emerald-900 text-emerald-300 rounded-md border-2 border-emerald-300">
          {status}
        </button>
      );
    case ComplaintPriorityStatusEnum.LOW:
      return (
        <button className="p-1 text-xs text-nowrap bg-slate-900 text-slate-300 rounded-md border-2 border-slate-300">
          {status}
        </button>
      );
  }
};

export const checkNull = (value: any, message: string, ifNotNullAdd?: string) => {
  return !value || value?.trim() === "" ? message : value + (ifNotNullAdd || '');
};

export function canAccess(userRoles: string[], allowedRoles: string[]): boolean {
  return allowedRoles.some((role) => userRoles?.includes(role));
}

export function getDir(lang: "ar" | "en") {
  return lang === "ar" ? "rtl" : "ltr";
}

export const handleData = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  key: keyof T,
  value: T[keyof T]
) => {
  setState((prev) => ({...prev, [key]: value}))
}