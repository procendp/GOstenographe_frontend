import { useState, useCallback, useRef } from 'react';

interface UploadedFile {
  file_key: string;
  file: File;
}

interface TabData {
  files: Array<{file: File, file_key: string}>;
  [key: string]: any;
}

export const useFileManagement = (tabs: TabData[], showComplete: boolean) => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});
  const isNavigatingAway = useRef(false);

  // 업로드된 모든 파일 수집
  const getAllUploadedFiles = useCallback((): UploadedFile[] => {
    const allFiles: UploadedFile[] = [];
    tabs.forEach(tab => {
      if (tab.files && tab.files.length > 0) {
        tab.files.forEach(f => {
          if (f.file_key && f.file_key !== 'uploading') {
            allFiles.push({ file_key: f.file_key, file: f.file });
          }
        });
      }
    });
    return allFiles;
  }, [tabs]);

  // 파일이 있는지 확인
  const hasUploadedFiles = useCallback((): boolean => {
    if (showComplete) return false;
    return getAllUploadedFiles().length > 0;
  }, [showComplete, getAllUploadedFiles]);

  // 페이지 이탈 시 파일 삭제
  const handleNavigateAway = useCallback(async (): Promise<void> => {
    if (isNavigatingAway.current) return; // 중복 실행 방지
    isNavigatingAway.current = true;

    const filesToDelete = getAllUploadedFiles();
    
    if (filesToDelete.length === 0) {
      isNavigatingAway.current = false;
      return;
    }

    console.log('[NAVIGATE_AWAY] 삭제할 파일:', filesToDelete.map(f => f.file_key));

    // S3에서 파일 삭제
    for (const fileData of filesToDelete) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/s3/delete/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_key: fileData.file_key })
        });
        
        if (response.ok) {
          console.log('[NAVIGATE_AWAY] 파일 삭제 성공:', fileData.file_key);
        } else {
          console.error('[NAVIGATE_AWAY] 파일 삭제 실패:', fileData.file_key);
        }
      } catch (error) {
        console.error('[NAVIGATE_AWAY] 파일 삭제 오류:', error);
      }
    }
    
    isNavigatingAway.current = false;
  }, [getAllUploadedFiles]);

  return {
    uploadStatus,
    setUploadStatus,
    getAllUploadedFiles,
    hasUploadedFiles,
    handleNavigateAway
  };
};
