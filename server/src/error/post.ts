import { CommonError } from '@/type/error'

export const PasswordNotMatch: CommonError = {
  status: 401,
  code: 'BOARD-001',
  message: '비밀번호가 일치하지 않습니다.'
}
