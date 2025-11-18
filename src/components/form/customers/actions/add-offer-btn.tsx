'use client'
import Button from "@/components/ui/button/Button";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";

export default function AddOfferBtn({customer_id}: {customer_id: string}) {
  const dispatch = useAppDispatch()
  return <Button onClick={() => dispatch(openPopup({popup: 'offerFormPopup' , data: {customer_id}}))} variant={'outline'}>Add Offer</Button>
}