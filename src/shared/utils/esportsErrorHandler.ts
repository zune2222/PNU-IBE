/**
 * E-Sports 관련 에러 처리 유틸리티
 */

import { useRouter } from 'next/router';
import { useToast } from '../components/Toast';

/**
 * 404 에러인지 확인
 */
export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    const message = (error as { message: string }).message;
    return (
      message.includes('404') ||
      message.includes('찾을 수 없습니다') ||
      message.includes('EntityNotFoundException')
    );
  }
  return false;
}

/**
 * 이벤트 조회 실패 시 공통 처리
 */
export function handleEventFetchError(
  error: unknown,
  router: ReturnType<typeof useRouter>,
  showToast: ReturnType<typeof useToast>['showToast']
): void {
  console.error('이벤트 정보 조회 실패:', error);

  if (isNotFoundError(error)) {
    showToast({
      type: 'error',
      message: '이벤트를 찾을 수 없습니다. 이벤트 목록으로 돌아갑니다.',
    });
    router.push('/esports');
  } else {
    showToast({
      type: 'error',
      message: '이벤트 정보를 불러올 수 없습니다.',
    });
  }
}



