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
    const presignedUrl = `${backendUrl}/api/s3/presigned-url/`;
    console.log('🌐 REQUEST_URL:', presignedUrl);
    
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

    // S3 업로드 응답 상세 분석
    console.log('🔍 S3 응답 분석:', {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
      headers: Object.fromEntries(uploadResponse.headers.entries()),
      url: presignedData.presigned_post.url
    });

    // S3 업로드 응답 처리 개선
    if (!uploadResponse.ok) {
      console.error('❌ S3 업로드 실패:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        url: presignedData.presigned_post.url
      });
      throw new Error(`S3 업로드 실패: ${uploadResponse.status}`);
    }

    // S3 업로드 성공 확인 (204 No Content 또는 200 OK)
    console.log('✅ S3 업로드 성공:', {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText
    });

    // 응답 본문 확인 (있는 경우)
    try {
      const responseText = await uploadResponse.text();
      if (responseText) {
        console.log('📄 S3 응답 본문:', responseText);
      }
    } catch (e) {
      console.log('📄 S3 응답 본문 읽기 실패 (정상일 수 있음):', e);
    }

    // 3단계: 성공 시 file_name 반환
    return {
      success: true,
      fileKey: presignedData.file_name,
    };
    
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    
    // 사용자에게 보이는 상세 에러 메시지
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // "Load failed" 오류인 경우 - 더 정확한 진단 필요
    if (errorMessage.includes('Load failed')) {
      console.log('⚠️ Load failed 오류 감지 - 정확한 원인 분석 필요');
      console.log('🔍 가능한 원인:');
      console.log('  1. S3 CORS 설정 문제');
      console.log('  2. 네트워크 타임아웃');
      console.log('  3. 브라우저 보안 정책');
      console.log('  4. S3 버킷 정책 문제');
      
      // 실제로는 실패로 처리하되, 사용자에게 명확한 안내 제공
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
    
    // 상세한 에러 정보를 사용자에게 표시
    const detailedError = `업로드 실패 상세 정보:
- 백엔드 URL: ${backendUrl}
- 파일명: ${file.name}
- 파일 크기: ${file.size} bytes
- 오류: ${errorMessage}
- 시간: ${new Date().toLocaleString()}`;
    
    console.error('🚨 UPLOAD_FINAL_ERROR:', detailedError);
    
    return {
      success: false,
      error: detailedError, // 사용자에게 상세 정보 표시
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