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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 허용된 확장자 목록 (페이지 안내와 동일)
    const ALLOWED_EXTENSIONS = [
      // 음성 파일
      'mp3', 'wav', 'm4a', 'cda', 'mod', 'ogg', 'wma', 'flac', 'asf',
      // 영상 파일
      'avi', 'mp4', 'wmv', 'm2v', 'mpeg', 'dpg', 'mts', 'webm', 'divx', 'amv',
      // 문서 파일 (추가 허용)
      'txt', 'hwp', 'doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx',
      // 압축 파일 (주석 처리 - 압축 파일 업로드 불가)
      // 'zip'
    ];

    // 파일 형식 검증
    const invalidFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !ext || !ALLOWED_EXTENSIONS.includes(ext);
    });

    if (invalidFiles.length > 0) {
      alert(`허용되지 않는 파일 형식입니다:\n${invalidFiles.map(f => f.name).join('\n')}\n\n허용 형식:\n- 음성: ${ALLOWED_EXTENSIONS.slice(0, 9).join(', ')}\n- 영상: ${ALLOWED_EXTENSIONS.slice(9, 19).join(', ')}`);
      e.target.value = '';
      return;
    }

    // 파일 크기 검증
    const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`다음 파일의 크기가 3GB를 초과합니다:\n${oversizedFiles.map(f => f.name).join('\n')}`);
      e.target.value = '';
      return;
    }

    const fileObjs = files.map(file => ({ file, file_key: '' }));
    setFormData({ ...formData, files: fileObjs });
    if (onFileSelect) {
      onFileSelect(e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);

    // 허용된 확장자 목록
    const ALLOWED_EXTENSIONS = [
      'mp3', 'wav', 'm4a', 'cda', 'mod', 'ogg', 'wma', 'flac', 'asf',
      'avi', 'mp4', 'wmv', 'm2v', 'mpeg', 'dpg', 'mts', 'webm', 'divx', 'amv',
      'txt', 'hwp', 'doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx'
      // 압축 파일 (주석 처리 - 압축 파일 업로드 불가)
      // 'zip'
    ];

    // 파일 형식 검증
    const invalidFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !ext || !ALLOWED_EXTENSIONS.includes(ext);
    });

    if (invalidFiles.length > 0) {
      alert(`허용되지 않는 파일 형식입니다:\n${invalidFiles.map(f => f.name).join('\n')}\n\n허용 형식:\n- 음성: ${ALLOWED_EXTENSIONS.slice(0, 9).join(', ')}\n- 영상: ${ALLOWED_EXTENSIONS.slice(9, 19).join(', ')}`);
      return;
    }

    // 파일 크기 검증
    const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`다음 파일의 크기가 3GB를 초과합니다:\n${oversizedFiles.map(f => f.name).join('\n')}`);
      return;
    }

    const fileObjs = files.map(file => ({ file, file_key: '' }));
    setFormData({ ...formData, files: fileObjs });
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
            <div>• 문서: txt, hwp, doc, docx, pdf, ppt, pptx, xls, xlsx</div>
            <div>• 음성: mp3, wav, m4a, cda, mod, ogg, wma, flac, asf</div>
            <div>• 영상: avi, mp4, wmv, m2v, mpeg, dpg, mts, webm, divx, amv</div>
          </div>
          <div className="text-xs text-red-500 mt-1">※ 파일당 최대 3GB까지 업로드 가능합니다.</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".mp3,.wav,.m4a,.cda,.mod,.ogg,.wma,.flac,.asf,.avi,.mp4,.wmv,.m2v,.mpeg,.dpg,.mts,.webm,.divx,.amv,.txt,.hwp,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
          multiple
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