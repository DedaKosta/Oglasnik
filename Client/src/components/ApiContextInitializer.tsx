import { useEffect, type ReactNode } from 'react'
import { useLoading } from '../contexts/LoadingContext'
import { useToast } from '../contexts/ToastContext'
import { setApiContexts } from '../utils/api'

export default function ApiContextInitializer({ children }: { children: ReactNode }) {
  const loading = useLoading()
  const toast = useToast()

  useEffect(() => {
    setApiContexts(
      {
        startLoading: loading.startLoading,
        stopLoading: loading.stopLoading,
      },
      {
        success: toast.success,
        error: toast.error,
      }
    )
  }, [loading, toast])

  return <>{children}</>
}
