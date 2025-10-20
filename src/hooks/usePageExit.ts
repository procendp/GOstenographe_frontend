import { useEffect, useCallback } from 'react';

interface UsePageExitProps {
  hasUploadedFiles: () => boolean;
  handleNavigateAway: () => Promise<void>;
  showComplete: boolean;
}

export const usePageExit = ({ hasUploadedFiles, handleNavigateAway, showComplete }: UsePageExitProps) => {
  // beforeunload 이벤트 - 새로고침/브라우저 닫기 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUploadedFiles()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUploadedFiles]);

  // popstate 이벤트 - 브라우저 뒤로가기 버튼 경고
  useEffect(() => {
    let isInitialized = false;

    const initializeHistory = () => {
      try {
        window.history.pushState(null, '', window.location.href);
        isInitialized = true;
      } catch (error) {
        console.warn('[HISTORY] 히스토리 초기화 실패:', error);
        setTimeout(initializeHistory, 100);
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!isInitialized || showComplete) return;
      
      if (hasUploadedFiles()) {
        const confirmLeave = window.confirm(
          '업로드된 파일이 있습니다.\n페이지를 나가시면 파일이 삭제됩니다.\n정말 나가시겠습니까?'
        );
        
        if (!confirmLeave) {
          try {
            window.history.pushState(null, '', window.location.href);
          } catch (error) {
            console.warn('[HISTORY] pushState 실패:', error);
          }
        } else {
          handleNavigateAway().then(() => {
            try {
              window.history.back();
            } catch (error) {
              console.warn('[HISTORY] back 실패:', error);
            }
          });
        }
      }
    };

    const timer = setTimeout(initializeHistory, 0);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUploadedFiles, handleNavigateAway, showComplete]);
};
