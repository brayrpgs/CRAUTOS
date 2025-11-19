import type { audit } from './audit'
import type { images } from './images'

export interface user {
  id_user?: number
  name: string
  last_name: string
  email: string
  idcard: string
  age: number
  audit?: audit | null
  rol: number
  images?: images | null
  phone: any
  id_images?: number | null
  id_audit?: number | null
}
