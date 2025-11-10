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
 * S3 Multipart Upload를 사용한 대용량 파일 업로드
 * 100MB 이상 파일에 최적화, 병렬 업로드로 속도 개선
 */
export async function uploadFileToS3Multipart(
  file: File,
  customerName: string,
  customerEmail: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per part
  const MAX_CONCURRENT_UPLOADS = 5; // 동시 업로드 수

  try {
    // 1단계: Multipart Upload 초기화
    const initResponse = await fetch(`${backendUrl}/api/s3/multipart/init/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      }),
    });

    if (!initResponse.ok) {
      const error = await initResponse.json();
      throw new Error(error.error || 'Multipart Upload 초기화 실패');
    }

    const { upload_id, file_key } = await initResponse.json();

    // 2단계: 파일을 청크로 분할
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      chunks.push(chunk);
      offset += CHUNK_SIZE;
    }

    // 3단계: 각 Part 업로드 (병렬 처리)
    const uploadedParts: { PartNumber: number; ETag: string }[] = [];
    let uploadedBytes = 0;

    // 병렬 업로드를 위한 함수
    const uploadPart = async (chunk: Blob, partNumber: number): Promise<void> => {
      // Presigned URL 요청
      const partUrlResponse = await fetch(`${backendUrl}/api/s3/multipart/upload-part/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_key,
          upload_id,
          part_number: partNumber,
        }),
      });

      if (!partUrlResponse.ok) {
        throw new Error(`Part ${partNumber} Presigned URL 생성 실패`);
      }

      const { presigned_url } = await partUrlResponse.json();

      // Part 업로드
      const uploadResponse = await fetch(presigned_url, {
        method: 'PUT',
        body: chunk,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Part ${partNumber} 업로드 실패`);
      }

      const etag = uploadResponse.headers.get('ETag');
      if (!etag) {
        throw new Error(`Part ${partNumber} ETag 없음`);
      }

      uploadedParts[partNumber - 1] = {
        PartNumber: partNumber,
        ETag: etag.replace(/"/g, ''), // ETag에서 따옴표 제거
      };

      // 진행률 업데이트
      uploadedBytes += chunk.size;
      const progress = Math.round((uploadedBytes / file.size) * 100);
      onProgress?.(progress);
    };

    // 병렬 업로드 실행
    for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = chunks.slice(i, i + MAX_CONCURRENT_UPLOADS);
      const uploadPromises = batch.map((chunk, index) =>
        uploadPart(chunk, i + index + 1)
      );
      await Promise.all(uploadPromises);
    }

    // 4단계: Multipart Upload 완료
    const completeResponse = await fetch(`${backendUrl}/api/s3/multipart/complete/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_key,
        upload_id,
        parts: uploadedParts,
      }),
    });

    if (!completeResponse.ok) {
      throw new Error('Multipart Upload 완료 실패');
    }

    return {
      success: true,
      fileKey: file_key,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

    // 실패 시 Multipart Upload 취소 시도
    try {
      await fetch(`${backendUrl}/api/s3/multipart/abort/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_key: (error as any).file_key,
          upload_id: (error as any).upload_id,
        }),
      });
    } catch (abortError) {
      // 취소 실패는 무시
    }

    return {
      success: false,
      error: `파일 업로드에 실패했습니다: ${errorMessage}`,
    };
  }
}

/**
 * 여러 파일을 순차적으로 업로드하는 함수
 * 파일 크기에 따라 자동으로 Single/Multipart Upload 선택
 */
export async function uploadMultipleFiles(
  files: File[],
  customerName: string,
  customerEmail: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<{ fileKey: string; file: File }[]> {
  const uploadedFiles: { fileKey: string; file: File }[] = [];
  const MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100MB 이상은 Multipart 사용

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // 파일 크기에 따라 업로드 방식 선택
    const useMultipart = file.size >= MULTIPART_THRESHOLD;

    const result = useMultipart
      ? await uploadFileToS3Multipart(
          file,
          customerName,
          customerEmail,
          (progress) => onProgress?.(i, progress)
        )
      : await uploadFileToS3(
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