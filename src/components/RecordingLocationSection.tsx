"use client";
import { ReceptionFormData } from '@/types/reception';

interface RecordingLocationSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  tabIndex?: number; // 탭 인덱스 추가
}

export default function RecordingLocationSection({ formData, setFormData, tabIndex = 0 }: RecordingLocationSectionProps) {
  const handleLocationChange = (location: '통화' | '현장') => {
    setFormData({ ...formData, recordingLocation: location });
  };

  // 탭별로 고유한 name 속성 생성
  const radioName = `recordingLocation_${tabIndex}`;

  return (
    <div className="w-layout-hflex c-type-container">
      <label 
        className="radio-button-field w-radio"
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <input
          type="radio"
          name={radioName}
          value="통화"
          checked={formData.recordingLocation === '통화'}
          onChange={() => handleLocationChange('통화')}
          className="w-form-formradioinput w-radio-input"
          style={{
            margin: 0,
            cursor: 'pointer'
          }}
        />
        <span 
          className="radio-button-label w-form-label"
          style={{
            fontFamily: 'Pretendard',
            fontSize: '16px',
            color: '#272929',
            cursor: 'pointer'
          }}
        >
          통화 녹음
        </span>
      </label>
      <label 
        className="radio-button-field w-radio"
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <input
          type="radio"
          name={radioName}
          value="현장"
          checked={formData.recordingLocation === '현장'}
          onChange={() => handleLocationChange('현장')}
          className="w-form-formradioinput w-radio-input"
          style={{
            margin: 0,
            cursor: 'pointer'
          }}
        />
        <span 
          className="radio-button-label w-form-label"
          style={{
            fontFamily: 'Pretendard',
            fontSize: '16px',
            color: '#272929',
            cursor: 'pointer'
          }}
        >
          현장 녹음
        </span>
      </label>
    </div>
  );
}

