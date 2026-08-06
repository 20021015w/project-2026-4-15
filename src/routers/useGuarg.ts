import { LocalStorage } from "@utils/method"
import { message } from "antd"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
export const useGurad = () => {
  const token = LocalStorage.getLocal("accessToken")
  const navigate = useNavigate()
  const hasChecked = useRef(false)
  useEffect(() => {
    // 防止React StrictMode导致的重复执行
    if (!hasChecked.current) {
      hasChecked.current = true
      if(!token ) {
        navigate('/login')
        message.warning('用户信息过期，请重新登录')
      }
    }
  },[token, navigate])
}