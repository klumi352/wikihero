/* eslint-disable camelcase */
export type ProtectKeys =
  | 'access_token'
  | 'expires_in'
  | 'refresh_token'
  | 'token_type'

export type Protect = {
  [propName in ProtectKeys]: string
}

export interface User {
  email?: string
  email_verified_at?: any
  name?: string
  id?: number
  is_baned?: 0 | 1
  level_data?: any
  user_roles?: 'admin' | 'user' | 'temp'
  temp_user?: 0 | 1
}
