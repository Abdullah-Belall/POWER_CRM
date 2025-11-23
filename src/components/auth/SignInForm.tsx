"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { setUser } from "@/store/slices/user-slice";
import { LangsEnum, SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { handleData } from "@/utils/base";
import { setCookie, SIGN_IN } from "@/utils/requests/client-reqs/common-reqs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked] = useState(false);
  const [userNameError, setUserNameError] = useState<[boolean, string]>([false, ''])
  const [passwordError, setPasswordError] = useState<[boolean, string]>([false, ''])
  const [data,setData] =useState({
    user_name: '',
    password: '',
  })
  const validation = () => {
    setUserNameError([false, ''])
    setPasswordError([false, ''])
    const {user_name, password} = data
    if(user_name.trim().length < 4) {
      setUserNameError([true,'Invaild user name'])
      return;
    }
    if(password.trim().length < 8 || password.trim().length > 24) {
      setPasswordError([true,'Invaild password'])
      return;
    }
    return true
  }
  const [loading,setLoading] = useState(false)
  const handleDone = async() => {
    if(loading) return;
    if(!validation()) return;
    setLoading(true)
    const res = await SIGN_IN({
      data: {
        ...data,
        tenant_domain: window.location.hostname === 'localhost' ? 'localhost.com' : window.location.hostname,
        lang: LangsEnum.EN
      }
    })
    if(res.done) {
      dispatch(openSnakeBar({
        type: SnakeBarTypeEnum.SUCCESS,
        message: 'Successfully signed in'
      }))
      dispatch(
        setUser({
          ...res.data.user,
        })
      );
      setCookie("access_token", res.data.access_token);
      router.push(data.password === "123456789" ? "/profile" : "/");
    } else {
      dispatch(openSnakeBar({
        message: res.message as string
      }))
    }
    setLoading(false)
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your user name and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <Label>
                    User Name <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Enter your user name" error={userNameError[0]} hint={userNameError[1]} value={data.user_name} onChange={(e) => handleData(setData, 'user_name', e.target.value)} />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={data.password}
                      onChange={(e) => handleData(setData, 'password', e.target.value)}
                      error={passwordError[0]} hint={passwordError[1]}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button onClick={handleDone} className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
