export const useToast = () => {
  const message = useState('invite-toast', () => '')
  const visible = useState('invite-toast-visible', () => false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const showToast = (text: string, duration = 1800) => {
    message.value = text
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return { message, visible, showToast }
}
