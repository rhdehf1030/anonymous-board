import dayjs from 'dayjs'

/**
 * 날짜 형식 변환
 * @param date Date
 * @returns string
 */
export const formatCreatedAt = (date?: string) => {
  if (!date) {
    return ''
  }

  return dayjs(date).format('MM월 DD일 HH:mm')
}
