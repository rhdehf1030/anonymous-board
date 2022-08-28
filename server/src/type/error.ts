import { TypeORMError } from 'typeorm'

/**
 * Common Error Interface
 */
export interface CommonError {
  status: number
  code: string
  message: string
}

/**
 * Error Response Object 변환
 * @param error Common Error Object
 * @returns Response용 Error 객체
 */
export const getErrorResponse = (error: CommonError) => {
  return {
    code: error.code,
    message: error.message ? error.message : error.message
  }
}

/**
 * TypeORM Error 변환
 * @param error TypeORM 에러
 * @returnsCommon Common Error Object
 */
export const convertTypeormErrorToCommonError = (
  error: TypeORMError
): CommonError => {
  return {
    status: 400,
    code: error.name,
    message: error.message
  }
}

/**
 * ICommonError Type Guard
 * @param object Error Object
 * @returns 타입 비교 결과
 */
export const isCommonError = (object: any): object is CommonError => {
  return 'status' in object && 'code' in object && 'message' in object
}

/**
 * TypeORM Error Type Guard
 * @param object Error Object
 * @returns 타입 비교 결과
 */
export const isTypeormError = (
  object: any
): object is TypeORMError & { code: string } => object instanceof TypeORMError
