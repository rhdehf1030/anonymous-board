import { CommonError } from '@/type/error'

export const NotFoundError: CommonError = {
  status: 404,
  code: 'COMMON-001',
  message: '데이터가 없습니다.'
}
