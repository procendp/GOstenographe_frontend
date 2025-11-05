// 파일 업로드 관련 유틸리티 함수들

export interface UploadResult {
  success: boolean;
  fileKey?: string;
  error?: string;
}

export interface PresignedUrlResponse {
  presigned_post: {
    url: string;
    fields: Record<string, string>;
  };
  file_name: string;
}

/**
 * S3에 파일을 업로드하는 함수
 */
export async function uploadFileToS3(
  file: File, 
  customerName: string, 
  customerEmail: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    // 1단계: Presigned URL 요청
    const presignedUrl = `${backendUrl}/api/s3/presigned-url/`;
    
    const presignedResponse = await fetch(presignedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        customer_name: customerName,
        customer_email: customerEmail,
      }),
    });

    if (!presignedResponse.ok) {
      const error = await presignedResponse.json();
      throw new Error(error.error || 'Presigned URL 생성 실패');
    }

    const presignedData: PresignedUrlResponse = await presignedResponse.json();
    
    // 2단계: S3에 파일 업로드
    const formData = new FormData();
    
    // S3 필드들을 FormData에 추가
    Object.entries(presignedData.presigned_post.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // 파일은 마지막에 추가
    formData.append('file', file);

    const uploadResponse = await fetch(presignedData.presigned_post.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 업로드 실패: ${uploadResponse.status}`);
    }

    // 3단계: 성공 시 file_name 반환
    return {
      success: true,
      fileKey: presignedData.file_name,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

    if (errorMessage.includes('Load failed')) {
      return {
        success: false,
        error: `네트워크 오류로 업로드 상태를 확인할 수 없습니다.

가능한 원인:
• 네트워크 연결 문제
• S3 서버 응답 지연
• 브라우저 보안 정책

해결 방법:
1. 네트워크 연결 확인
2. 페이지 새로고침 후 재시도
3. 다른 브라우저로 시도
4. 파일 크기 확인 (너무 큰 경우)

상세 오류: ${errorMessage}`,
      };
    }

    return {
      success: false,
      error: `파일 업로드에 실패했습니다: ${errorMessage}`,
    };
  }
}

/**
 * 백엔드에 파일 정보를 저장하는 함수
 */
export async function saveFileInfo(
  requestId: number,
  file: File,
  fileKey: string
): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/requests/${requestId}/upload_file/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_key: fileKey,
      }),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * 여러 파일을 순차적으로 업로드하는 함수
 */
export async function uploadMultipleFiles(
  files: File[],
  customerName: string,
  customerEmail: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<{ fileKey: string; file: File }[]> {
  const uploadedFiles: { fileKey: string; file: File }[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const result = await uploadFileToS3(
      file,
      customerName,
      customerEmail,
      (progress) => onProgress?.(i, progress)
    );
    
    if (result.success && result.fileKey) {
      uploadedFiles.push({
        fileKey: result.fileKey,
        file: file,
      });
    } else {
      throw new Error(`파일 "${file.name}" 업로드 실패: ${result.error}`);
    }
  }
  
  return uploadedFiles;
}