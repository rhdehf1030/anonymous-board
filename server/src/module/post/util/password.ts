import bcrypt from 'bcrypt'

/**
 * 비밀번호 Encrypt
 * @param password password
 * @returns encrypted password
 */
export function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

/**
 * 비밀번호 비교
 * @param password input password
 * @param encryptedPassword saved password
 * @returns password match
 */
export function comparePassword(password: string, encryptedPassword: string) {
  return bcrypt.compareSync(password, encryptedPassword)
}
