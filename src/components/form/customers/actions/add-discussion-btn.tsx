'use client'
import Button from "@/components/ui/button/Button";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openPopup } from "@/store/slices/popups-slice";

export default function AddDiscussionBtn({customer_id}: {customer_id: string}) {
  const dispatch = useAppDispatch()
  return <Button onClick={() => dispatch(openPopup({popup: 'discussionFormPopup' , data: {customer_id}}))} variant={'outline'}>Add Discussion</Button>
}