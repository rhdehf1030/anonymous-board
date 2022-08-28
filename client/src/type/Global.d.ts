/* eslint-disable no-unused-vars */
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    plainLayout?: boolean
    fullLayout?: boolean
    post?: string
  }
}

declare global {
  interface Window {
    IMP: any
    jQuery: any
    FCM_TOKEN: string
  }
}
