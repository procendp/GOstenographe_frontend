/**
 * Z-Index 레이어 관리
 *
 * 프로젝트 전체에서 사용하는 z-index 값을 중앙 관리합니다.
 * 레이어 충돌을 방지하고 일관성을 유지합니다.
 */

export const Z_INDEX = {
  /**
   * 네비게이션 바 (GNB)
   * - ApplyGNB, MainGNB
   * - 항상 페이지 최상단에 고정
   */
  GNB: 1000,

  /**
   * 하단 고정 견적란
   * - c-checkout-section-new
   * - GNB보다는 아래, 일반 콘텐츠보다는 위
   */
  CHECKOUT: 100,

  /**
   * 네이티브 입력 오버레이
   * - 날짜/시간 선택 input의 투명 오버레이
   * - 스타일링된 div 위에 표시
   */
  INPUT_OVERLAY: 1,

  /**
   * 모달 오버레이 (배경)
   * - 모든 모달의 어두운 배경
   * - 주소 검색, 탭 삭제, 페이지 이탈 경고 모달
   */
  MODAL_OVERLAY: 9999,

  /**
   * 모달 콘텐츠
   * - 모달 오버레이 위에 표시되는 실제 내용
   * - (현재는 사용하지 않지만 향후 필요 시 사용)
   */
  MODAL_CONTENT: 10000,
} as const;

// 타입 추론을 위한 export
export type ZIndexLayer = keyof typeof Z_INDEX;
