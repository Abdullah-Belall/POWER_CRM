'use client'
import Button from "@/components/ui/button/Button";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";
import { TbStatusChange } from "react-icons/tb";

export default function UpdateCustomerStatusBtn({customer_id}: {customer_id: string}) {
  const dispatch = useAppDispatch()
  return <Button onClick={() => dispatch(openPopup({popup: 'updateCustomerStatusFormPopup' , data: {customer_id}}))} endIcon={<TbStatusChange className="text-lg" />}>Update Status</Button>
}