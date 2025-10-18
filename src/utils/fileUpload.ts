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
    // 디버깅: 환경변수 확인
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    console.log('🔍 DEBUG - Backend URL:', backendUrl);
    console.log('🔍 DEBUG - File info:', { name: file.name, size: file.size, type: file.type });
    
    // 서버 로그용 디버깅 (Vercel Functions 로그에서 확인 가능)
    console.log('🚀 UPLOAD_ATTEMPT:', JSON.stringify({
      timestamp: new Date().toISOString(),
      backendUrl: backendUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    }));
    
    // 1단계: Presigned URL 요청
    const presignedResponse = await fetch(`${backendUrl}/api/s3/presigned-url/`, {
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
      console.error('❌ Presigned URL 요청 실패:', {
        status: presignedResponse.status,
        statusText: presignedResponse.statusText,
        error: error
      });
      
      // Vercel 로그용 에러 로깅
      console.error('🚨 PRESIGNED_URL_ERROR:', JSON.stringify({
        timestamp: new Date().toISOString(),
        status: presignedResponse.status,
        statusText: presignedResponse.statusText,
        error: error,
        backendUrl: backendUrl
      }));
      
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
      console.error('❌ S3 업로드 실패:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        url: presignedData.presigned_post.url
      });
      throw new Error(`S3 업로드 실패: ${uploadResponse.status}`);
    }

    // 3단계: 성공 시 file_name 반환
    return {
      success: true,
      fileKey: presignedData.file_name,
    };
    
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    
    // Vercel 로그용 최종 에러 로깅
    console.error('🚨 UPLOAD_FINAL_ERROR:', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
      fileName: file.name,
      fileSize: file.size
    }));
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
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
    console.error('파일 정보 저장 오류:', error);
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