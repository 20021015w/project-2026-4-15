import { useAppSelector } from "@/app/hook"
import { userInfo } from '@/features/userInfo/userInfoSlice'
import { message } from "antd"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
export const useGurad = () => {
  const user = useAppSelector(userInfo)
  const navigate = useNavigate()
  const {token,id} = user
  const hasChecked = useRef(false)
  useEffect(() => {
    // 防止React StrictMode导致的重复执行
    if (!hasChecked.current) {
      hasChecked.current = true
      if(!token || !id) {
        navigate('/login')
        message.warning('用户信息过期，请重新登录')
      }
    }
  },[token, id, navigate])
}