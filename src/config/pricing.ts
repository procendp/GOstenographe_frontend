/**
 * 가격 정책 설정
 *
 * 속기 서비스의 가격표와 옵션 가격을 관리합니다.
 * 가격 변경 시 이 파일만 수정하면 됩니다.
 */

/**
 * 녹음 종류
 */
export type RecordingLocationType = '통화' | '현장';

/**
 * 최종본 옵션 타입
 */
export type FinalOptionType = 'file' | 'file_usb' | 'file_usb_cd' | 'file_usb_post';

/**
 * 가격 테이블 항목
 */
export interface PriceTableItem {
  maxMinutes: number;
  price: number;
}

/**
 * 녹음 종류별 가격표
 *
 * - 통화 녹음: 상대적으로 저렴한 요금
 * - 현장 녹음: 통화보다 높은 요금
 *
 * 분량에 따라 차등 적용되며, 60분 초과 시 10분 단위 추가 과금
 */
export const PRICE_TABLE: Record<RecordingLocationType, PriceTableItem[]> = {
  '통화': [
    { maxMinutes: 3, price: 30000 },
    { maxMinutes: 5, price: 40000 },
    { maxMinutes: 10, price: 70000 },
    { maxMinutes: 20, price: 100000 },
    { maxMinutes: 30, price: 120000 },
    { maxMinutes: 40, price: 140000 },
    { maxMinutes: 50, price: 160000 },
    { maxMinutes: 60, price: 180000 },
  ],
  '현장': [
    { maxMinutes: 3, price: 50000 },
    { maxMinutes: 5, price: 60000 },
    { maxMinutes: 10, price: 90000 },
    { maxMinutes: 20, price: 120000 },
    { maxMinutes: 30, price: 140000 },
    { maxMinutes: 40, price: 160000 },
    { maxMinutes: 50, price: 180000 },
    { maxMinutes: 60, price: 200000 },
  ],
} as const;

/**
 * 60분 초과 시 10분당 추가 요금
 *
 * - 통화: 30,000원 / 10분
 * - 현장: 40,000원 / 10분
 *
 * 예) 80분 통화 = 60분 기본(180,000원) + 2구간(60,000원) = 240,000원
 */
export const OVERTIME_RATE: Record<RecordingLocationType, number> = {
  통화: 30000,
  현장: 40000,
} as const;

/**
 * 최종본 옵션별 추가 가격
 *
 * - file: 파일만 (무료)
 * - file_usb: 파일 + 등기우편 (+5,000원)
 * - file_usb_cd: 파일 + 등기우편 + CD (+6,000원)
 * - file_usb_post: 파일 + 등기우편 + USB (+10,000원)
 */
export const FINAL_OPTION_PRICES: Record<FinalOptionType, number> = {
  file: 0,
  file_usb: 5000,
  file_usb_cd: 6000,
  file_usb_post: 10000,
} as const;

/**
 * 최종본 옵션 표시 텍스트
 */
export const FINAL_OPTION_LABELS: Record<FinalOptionType, string> = {
  file: '파일',
  file_usb: '파일+등기우편',
  file_usb_cd: '파일+등기우편+CD',
  file_usb_post: '파일+등기우편+USB',
} as const;

/**
 * 부가세율 (10%)
 */
export const VAT_RATE = 0.1;
