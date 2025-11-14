import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ReceptionFormData } from '@/types/reception';

interface FileUploadSectionProps {
  formData: ReceptionFormData & { fileDuration?: string };
  setFormData: (data: ReceptionFormData) => void;
  onBack?: () => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadStatus?: Record<string, 'idle' | 'uploading' | 'success' | 'error'>;
  uploadProgress?: Record<string, number>;
  currentTabIndex?: number;
  onDeleteFile?: (tabIndex: number) => void;
}

export default function FileUploadSection({ formData, setFormData, onBack, onFileSelect, uploadStatus: externalUploadStatus, uploadProgress = {}, currentTabIndex = 0, onDeleteFile }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalUploadStatus, setInternalUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

  // 외부에서 전달받은 업로드 상태를 우선 사용
  const uploadStatus = externalUploadStatus || internalUploadStatus;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    const file = files[0]; // 1개만 선택 가능

    // 허용된 확장자 목록 (영상/음성 파일만)
    const ALLOWED_EXTENSIONS = [
      // 음성 파일
      'mp3', 'wav', 'm4a', 'cda', 'mod', 'ogg', 'wma', 'flac', 'asf',
      // 영상 파일
      'avi', 'mp4', 'wmv', 'm2v', 'mpeg', 'dpg', 'mts', 'webm', 'divx', 'amv'
    ];

    // 파일 형식 검증
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`❌ 영상/음성 파일만 업로드 가능합니다.\n\n선택한 파일: ${file.name}\n\n✅ 허용 형식:\n- 음성: mp3, wav, m4a, cda, mod, ogg, wma, flac, asf\n- 영상: avi, mp4, wmv, m2v, mpeg, dpg, mts, webm, divx, amv`);
      e.target.value = '';
      return;
    }

    // 파일 크기 검증
    const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    if (file.size > MAX_SIZE) {
      alert(`파일의 크기가 3GB를 초과합니다:\n${file.name}`);
      e.target.value = '';
      return;
    }

    // 기존에 업로드된 파일이 있는지 확인
    const existingFile = formData.files[0];
    if (existingFile && existingFile.file_key && existingFile.file_key !== 'uploading') {
      const confirmReplace = window.confirm(
        `기존에 업로드한 파일이 삭제됩니다.\n다시 업로드하시겠습니까?\n\n기존 파일: ${existingFile.file?.name || '알 수 없음'}\n새 파일: ${file.name}`
      );
      
      if (!confirmReplace) {
        e.target.value = '';
        return;
      }
      
      // 기존 S3 파일 삭제
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/s3/delete/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_key: existingFile.file_key })
        });
        
        if (response.ok) {
          console.log('[FILE_REPLACE] 기존 파일 삭제 성공:', existingFile.file_key);
        } else {
          console.error('[FILE_REPLACE] 기존 파일 삭제 실패:', existingFile.file_key);
        }
      } catch (error) {
        console.error('[FILE_REPLACE] 파일 삭제 오류:', error);
      }
    }

    const fileObj = { file, file_key: '' };
    setFormData({ ...formData, files: [fileObj] });
    if (onFileSelect) {
      onFileSelect(e);
    }
    
    // 같은 파일을 다시 선택할 수 있도록 input value 초기화
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;
    
    const file = files[0]; // 1개만 선택 가능

    // 허용된 확장자 목록 (영상/음성 파일만)
    const ALLOWED_EXTENSIONS = [
      'mp3', 'wav', 'm4a', 'cda', 'mod', 'ogg', 'wma', 'flac', 'asf',
      'avi', 'mp4', 'wmv', 'm2v', 'mpeg', 'dpg', 'mts', 'webm', 'divx', 'amv'
    ];

    // 파일 형식 검증
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`❌ 영상/음성 파일만 업로드 가능합니다.\n\n선택한 파일: ${file.name}\n\n✅ 허용 형식:\n- 음성: mp3, wav, m4a, cda, mod, ogg, wma, flac, asf\n- 영상: avi, mp4, wmv, m2v, mpeg, dpg, mts, webm, divx, amv`);
      return;
    }

    // 파일 크기 검증
    const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    if (file.size > MAX_SIZE) {
      alert(`파일의 크기가 3GB를 초과합니다:\n${file.name}`);
      return;
    }

    // 기존에 업로드된 파일이 있는지 확인
    const existingFile = formData.files[0];
    if (existingFile && existingFile.file_key && existingFile.file_key !== 'uploading') {
      const confirmReplace = window.confirm(
        `기존에 업로드한 파일이 삭제됩니다.\n다시 업로드하시겠습니까?\n\n기존 파일: ${existingFile.file?.name || '알 수 없음'}\n새 파일: ${file.name}`
      );
      
      if (!confirmReplace) {
        return;
      }
      
      // 기존 S3 파일 삭제
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/s3/delete/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_key: existingFile.file_key })
        });
        
        if (response.ok) {
          console.log('[FILE_REPLACE] 기존 파일 삭제 성공:', existingFile.file_key);
        } else {
          console.error('[FILE_REPLACE] 기존 파일 삭제 실패:', existingFile.file_key);
        }
      } catch (error) {
        console.error('[FILE_REPLACE] 파일 삭제 오류:', error);
      }
    }

    const fileObj = { file, file_key: '' };
    setFormData({ ...formData, files: [fileObj] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="파일 업로드 영역. 클릭하거나 파일을 드래그하여 업로드하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="border-4 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-white min-h-[140px] flex flex-col justify-center"
        >
          <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
          <div className="text-gray-500 mb-4">
            {formData.files.length > 0 ? (
              <div>
                <p className="font-medium mb-2">선택된 파일:</p>
                {formData.files.map((f: any, index: number) => {
                  const fileName = f.file?.name || f.name || '';
                  const status = uploadStatus[fileName] || 'idle';
                  const progress = uploadProgress[fileName] || 0;
                  return (
                    <span key={index} className="flex items-center justify-center gap-2 text-base">
                      <span className="font-bold">{fileName}</span>
                      {status === 'uploading' && (
                        <>
                          <FaSpinner className="animate-spin text-blue-400" title="업로드 중" />
                          <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>
                            {progress}%
                          </span>
                        </>
                      )}
                      {status === 'success' && <FaCheckCircle className="text-green-500" title="업로드 완료" />}
                      {status === 'error' && <FaExclamationCircle className="text-red-500" title="업로드 실패" />}
                    </span>
                  );
                })}
              </div>
            ) : (
              "클릭하거나 파일을 드래그하여 업로드하세요."
            )}
          </div>
          <div className="text-xs text-red-500 mt-1">※ 영상/음성 파일만 업로드 가능합니다. (파일당 최대 3GB)</div>
        </div>

        {/* 현재 탭에 업로드된 파일 표시 */}
        {formData.files && formData.files.length > 0 && formData.files[0].file_key && formData.files[0].file_key !== 'uploading' && (
          <div style={{
            marginTop: '24px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>📎</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                업로드된 파일
              </span>
            </div>

            <div style={{ padding: '8px' }}>
              {(() => {
                const file = formData.files[0];
                const fileName = file.file?.name || '';
                const fileSize = file.file?.size || 0;
                const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1);
                const duration = formData.fileDuration || '00:00:00';
                const status = uploadStatus[fileName] || 'idle';
                const progress = uploadProgress[fileName] || 0;

                return (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6b7280',
                            backgroundColor: '#e5e7eb',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}>
                            파일 {currentTabIndex + 1}
                          </span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {fileName}
                          </span>
                          {status === 'uploading' && (
                            <>
                              <FaSpinner className="animate-spin text-blue-400" style={{ flexShrink: 0 }} />
                              <span style={{
                                fontSize: '12px',
                                color: '#3b82f6',
                                fontWeight: '500',
                                flexShrink: 0
                              }}>
                                {progress}%
                              </span>
                            </>
                          )}
                          {status === 'success' && <FaCheckCircle className="text-green-500" style={{ flexShrink: 0 }} />}
                          {status === 'error' && <FaExclamationCircle className="text-red-500" style={{ flexShrink: 0 }} />}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <span>{duration}</span>
                          <span>•</span>
                          <span>{fileSizeMB} MB</span>
                        </div>
                      </div>
                      {onDeleteFile && (
                        <button
                          onClick={() => onDeleteFile(currentTabIndex)}
                          aria-label={`파일 ${currentTabIndex + 1} 삭제`}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#dc2626',
                            backgroundColor: 'white',
                            border: '1px solid #dc2626',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".mp3,.wav,.m4a,.cda,.mod,.ogg,.wma,.flac,.asf,.avi,.mp4,.wmv,.m2v,.mpeg,.dpg,.mts,.webm,.divx,.amv"
          aria-label="음성 또는 영상 파일 선택"
        />
      </div>
      <div className="flex justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            이전
          </button>
        )}
      </div>
    </div>
  );
} 