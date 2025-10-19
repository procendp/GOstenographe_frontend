import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ReceptionFormData } from '@/types/reception';

interface FileUploadSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onBack?: () => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadSection({ formData, setFormData, onBack, onFileSelect }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

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
          className="border-4 border-dashed border-gray-400 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors bg-white min-h-[200px] flex flex-col justify-center"
        >
          <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
          <div className="text-gray-500 mb-4">
            {formData.files.length > 0 ? (
              <div>
                <p className="font-medium mb-2">선택된 파일:</p>
                {formData.files.map((f: any, index: number) => {
                  const fileName = f.file?.name || f.name || '';
                  const status = uploadStatus[fileName] || 'idle';
                  return (
                    <span key={index} className="flex items-center justify-center gap-2 text-base">
                      <span className="font-bold">{fileName}</span>
                      {status === 'uploading' && <FaSpinner className="animate-spin text-blue-400" title="업로드 중" />}
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
          <div className="text-sm text-gray-400 space-y-1">
            <div>• 음성: mp3, wav, m4a, cda, mod, ogg, wma, flac, asf</div>
            <div>• 영상: avi, mp4, wmv, m2v, mpeg, dpg, mts, webm, divx, amv</div>
          </div>
          <div className="text-xs text-red-500 mt-1">※ 영상/음성 파일만 업로드 가능합니다. (파일당 최대 3GB)</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".mp3,.wav,.m4a,.cda,.mod,.ogg,.wma,.flac,.asf,.avi,.mp4,.wmv,.m2v,.mpeg,.dpg,.mts,.webm,.divx,.amv"
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