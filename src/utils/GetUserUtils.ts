import { jwtDecode } from 'jwt-decode'

// Tipo del payload del token
export interface TokenPayload {
  id_user: number
  name: string
  last_name: string
  email: string
  idcard: string | null
  age: number
  id_audit: number | null
  rol: number
  iat: number
}

// Tipo del resultado del util
export interface TokenResultSuccess {
  ok: true
  userId: number
  rol: number
  fullPayload: TokenPayload
}

export interface TokenResultError {
  ok: false
  message: string
}

export type TokenResult = TokenResultSuccess | TokenResultError

// Util principal (solo decodifica, no valida firma)
function getUserFromToken (token: string): TokenResult {
  try {
    const decoded = jwtDecode<TokenPayload>(token)

    return {
      ok: true,
      userId: decoded.id_user,
      rol: decoded.rol,
      fullPayload: decoded
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Token inválido o no decodificable'
    }
  }
}

/* -------------------------------------------------------------
   OBTENER SOLO EL ID DEL USUARIO
------------------------------------------------------------- */
export function getLoggedUserId (): number | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem('User_Token')
  if (token == null) return null

  const result = getUserFromToken(token)
  if (!result.ok) return null

  return result.userId
}

/* -------------------------------------------------------------
   OBTENER SOLO EL ROL DEL USUARIO
------------------------------------------------------------- */
export function getLoggedUserRole (): number | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem('User_Token')
  if (token == null) return null

  const result = getUserFromToken(token)
  if (!result.ok) return null

  return result.rol
}

/* -------------------------------------------------------------
   OBTENER TODO EL USUARIO DECODIFICADO
------------------------------------------------------------- */
export function getLoggedUser (): TokenPayload | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem('User_Token')
  if (token == null) return null

  const result = getUserFromToken(token)
  if (!result.ok) return null

  return result.fullPayload
}

/* -------------------------------------------------------------
   SABER SI HAY UN USUARIO LOGUEADO
------------------------------------------------------------- */
export function isUserLogged (): boolean {
  if (typeof window === 'undefined') return false

  const token = window.localStorage.getItem('User_Token')
  if (token == null) return false

  const result = getUserFromToken(token)
  return result.ok
}
