export function getDeviceType() {
  const width = window.innerWidth

  if (width <= 768) {
    return 'phone'
  }

  return 'desktop'
}