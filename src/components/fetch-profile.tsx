"use client";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { useAppSelector } from "@/store/hooks/selector";
import { selectCurrentUserMainData, setUser } from "@/store/slices/user-slice";
import { CLIENT_COLLECTOR_REQ, CURR_USER_PROFILE, REFRESH_TOKEN_REQ, setCookie } from "@/utils/requests/client-reqs/common-reqs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect} from "react";

export default function FetchProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUserMainData())
  const pathname = usePathname()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(CURR_USER_PROFILE);
    if (res.done) {
      setCookie("lang", res.data.lang);
      dispatch(setUser(res.data));
    } else {
      router.push("/signin");
    }
  };

  useEffect(() => {
    if(!user.id && pathname !== '/signin' ){
      fetchData()
    }
  }, [user])
  return <></>;
}
