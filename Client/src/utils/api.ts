type ApiOptions = {
  showLoading?: boolean
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

let loadingContext: { startLoading: () => void; stopLoading: () => void } | null = null
let toastContext: { success: (msg: string) => void; error: (msg: string) => void } | null = null

export function setApiContexts(
  loading: { startLoading: () => void; stopLoading: () => void },
  toast: { success: (msg: string) => void; error: (msg: string) => void }
) {
  loadingContext = loading
  toastContext = toast
}

export async function apiRequest<T>(
  request: () => Promise<T>,
  options: ApiOptions = {}
): Promise<T> {
  const {
    showLoading = true,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    onSuccess,
    onError,
  } = options

  if (showLoading && loadingContext) {
    loadingContext.startLoading()
  }

  try {
    const result = await request()

    if (showSuccessToast && toastContext) {
      toastContext.success(successMessage)
    }

    if (onSuccess) {
      onSuccess(result)
    }

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    if (showErrorToast && toastContext) {
      toastContext.error(errorMessage)
    }

    if (onError) {
      onError(error as Error)
    }

    throw error
  } finally {
    if (showLoading && loadingContext) {
      loadingContext.stopLoading()
    }
  }
}
