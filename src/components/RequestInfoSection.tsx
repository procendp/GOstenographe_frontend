import { ReceptionFormData } from '@/types/reception';
import { useState } from 'react';

interface RequestInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function RequestInfoSection({ formData, setFormData, onNext, onBack }: RequestInfoSectionProps) {
  const [selectedType, setSelectedType] = useState<'전체' | '부분'>('전체');

  const handleSpeakerCountChange = (count: number) => {
    const newCount = Math.min(5, Math.max(1, count));
    const newSpeakerNames = [...formData.speakerNames];
    newSpeakerNames.length = newCount;
    for (let i = 0; i < newCount; i++) {
      if (!newSpeakerNames[i]) newSpeakerNames[i] = '';
    }
    setFormData({ ...formData, speakerCount: newCount, speakerNames: newSpeakerNames });
  };

  const handleSpeakerNameChange = (index: number, name: string) => {
    const newSpeakerNames = [...formData.speakerNames];
    newSpeakerNames[index] = name;
    setFormData({ ...formData, speakerNames: newSpeakerNames });
  };

  const handleDateAdd = () => {
    setFormData({
      ...formData,
      selectedDates: [...formData.selectedDates, '']
    });
  };

  const handleDetailChange = (detail: string) => {
    setFormData({ ...formData, detail });
  };

  // 시:분:초 핀 리스트 관련 (스크롤 방식)
  const handleTimestampChange = (index: number, type: 'hour' | 'minute' | 'second', value: string) => {
    const newTimestamps = [...formData.timestamps];
    // 기존 값 분해
    const [h, m, s] = (newTimestamps[index] || '00:00:00').split(':');
    let hour = h, minute = m, second = s;
    if (type === 'hour') hour = value;
    if (type === 'minute') minute = value;
    if (type === 'second') second = value;
    newTimestamps[index] = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
    setFormData({ ...formData, timestamps: newTimestamps });
  };
  const handleTimestampAdd = () => {
    setFormData({ ...formData, timestamps: [...formData.timestamps, '00:00:00'] });
  };
  const handleTimestampRemove = (index: number) => {
    const newTimestamps = [...formData.timestamps];
    newTimestamps.splice(index, 1);
    setFormData({ ...formData, timestamps: newTimestamps });
  };

  return (
    <div className="space-y-8">
      {/* 파일 업로드 섹션은 상위에서 렌더링됨(주석 처리) */}
      {/* <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">파일 업로드</h3>
          <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
        </div>
        ...
      </div> */}

      {/* 녹취 종류 카드형 */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">녹취 종류</h3>
          <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
        </div>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-6 py-2 rounded-lg border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${selectedType === '전체' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setSelectedType('전체')}
          >
            전체 녹취
          </button>
          <button
            className={`px-6 py-2 rounded-lg border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${selectedType === '부분' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setSelectedType('부분')}
          >
            부분 녹취
          </button>
        </div>
        {/* 시:분:초 핀 리스트 입력 UI (스크롤 방식) */}
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <h4 className="text-base font-medium mr-2">동영상 시점</h4>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">선택</span>
          </div>
          {formData.timestamps.map((ts, idx) => {
            const [h, m, s] = (ts || '00:00:00').split(':');
            return (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <select value={h} onChange={e => handleTimestampChange(idx, 'hour', e.target.value)} className="px-2 py-1 border border-gray-300 rounded-md">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span>:</span>
                <select value={m} onChange={e => handleTimestampChange(idx, 'minute', e.target.value)} className="px-2 py-1 border border-gray-300 rounded-md">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span>:</span>
                <select value={s} onChange={e => handleTimestampChange(idx, 'second', e.target.value)} className="px-2 py-1 border border-gray-300 rounded-md">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <button type="button" onClick={() => handleTimestampRemove(idx)} className="ml-2 text-red-500 hover:text-red-700 font-medium">삭제</button>
              </div>
            );
          })}
          <button type="button" onClick={handleTimestampAdd} className="text-blue-600 hover:text-blue-700 font-medium">+ 추가</button>
        </div>
      </div>

      {/* 화자 정보 카드형 */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">화자 정보</h3>
          <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
        </div>
        <div className="flex space-x-4 mb-4">
          <input
            type="number"
            min="1"
            max="5"
            value={formData.speakerCount}
            onChange={(e) => handleSpeakerCountChange(parseInt(e.target.value) || 1)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-gray-500">화자 수의 최대값은 5명입니다.</div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: formData.speakerCount }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-gray-500 w-24">화자 {index + 1}</span>
              <input
                type="text"
                placeholder="화자 이름 입력"
                value={formData.speakerNames[index] || ''}
                onChange={(e) => handleSpeakerNameChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 녹음 일시 카드형 */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">녹음 일시</h3>
          <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
        </div>
        <div className="space-y-4">
          {formData.selectedDates.map((_, index) => (
            <div key={index} className="flex items-center">
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            onClick={handleDateAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            + 추가
          </button>
        </div>
      </div>

      {/* 상세 정보 카드형 */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold mr-2">상세 정보</h3>
          <span className="bg-gray-200 text-blue-600 text-xs font-bold px-2 py-1 rounded ml-2">선택</span>
        </div>
        <textarea
          rows={4}
          placeholder="추가로 전달하실 내용이 있다면 자유롭게 작성해 주세요."
          value={formData.detail}
          onChange={(e) => handleDetailChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
} 