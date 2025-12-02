"use client"
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import Image from "next/image";
import BlackLayer from "../black-layer";
import { useAppDispatch } from "@/store/hooks/dispatch";

export function ViewImage() {
  const popup = useAppSelector(selectPopup('viewImagePopup'))
  const dispatch = useAppDispatch()
  return popup.isOpen ? <BlackLayer onClick={() => dispatch(closePopup({popup: 'viewImagePopup'}))}>
                          <Image width={900} height={600} src={popup.data?.src || ''} alt="Image" />
                        </BlackLayer>
                      : ''
}