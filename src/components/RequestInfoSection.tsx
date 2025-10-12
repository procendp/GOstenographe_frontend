import { ReceptionFormData, TimestampRange } from '@/types/reception';
import { useState, useEffect, useCallback } from 'react';
import TimestampInput from './TimestampInput';
import { createEmptyTimestampRange, calculateTotalDuration } from '@/utils/timestampUtils';

interface RequestInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
  fileDuration?: string; // 파일 총 길이
}

export default function RequestInfoSection({ formData, setFormData, onNext, onBack, fileDuration }: RequestInfoSectionProps) {
  const [totalDuration, setTotalDuration] = useState('00:00:00');
  const [durationExceeded, setDurationExceeded] = useState(false);
  const MAX_TIMESTAMP_RANGES = 10; // Configurable maximum

  // Initialize timestamp ranges if not present
  useEffect(() => {
    if (!formData.timestampRanges || formData.timestampRanges.length === 0) {
      const defaultRanges = [
        createEmptyTimestampRange()
      ];
      setFormData({
        ...formData,
        timestampRanges: defaultRanges
      });
    }
  }, [formData, setFormData]);

  // Calculate total duration whenever timestamp ranges change
  useEffect(() => {
    if (formData.timestampRanges) {
      const duration = calculateTotalDuration(formData.timestampRanges);
      setTotalDuration(duration);
      
      // 부분 녹취 시 각 구간의 시작/종료 시간이 파일 총 길이를 초과하는지 검증
      if (formData.recordType === '부분' && fileDuration && fileDuration !== '00:00:00') {
        const { timeToSeconds } = require('@/utils/timestampUtils');
        const fileSeconds = timeToSeconds(fileDuration);
        
        // 각 타임스탬프 구간이 파일 길이 범위 내에 있는지 확인
        const hasExceeded = formData.timestampRanges.some(range => {
          if (!range.startTime || !range.endTime) return false;
          
          const startSeconds = timeToSeconds(range.startTime);
          const endSeconds = timeToSeconds(range.endTime);
          
          // 시작 시간 또는 종료 시간이 파일 길이를 초과하는지 확인
          return startSeconds > fileSeconds || endSeconds > fileSeconds;
        });
        
        setDurationExceeded(hasExceeded);
      } else {
        setDurationExceeded(false);
      }
    }
  }, [formData.timestampRanges, formData.recordType, fileDuration]);

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

  // New timestamp range handlers
  const handleTimestampRangeUpdate = useCallback((index: number, updatedRange: TimestampRange) => {
    const newRanges = [...(formData.timestampRanges || [])];
    newRanges[index] = updatedRange;
    setFormData({ ...formData, timestampRanges: newRanges });
  }, [formData, setFormData]);

  const handleTimestampRangeDelete = useCallback((index: number) => {
    const newRanges = [...(formData.timestampRanges || [])];
    newRanges.splice(index, 1);
    setFormData({ ...formData, timestampRanges: newRanges });
  }, [formData, setFormData]);

  const handleTimestampRangeAdd = useCallback(() => {
    if ((formData.timestampRanges?.length || 0) < MAX_TIMESTAMP_RANGES) {
      const newRanges = [...(formData.timestampRanges || []), createEmptyTimestampRange()];
      setFormData({ ...formData, timestampRanges: newRanges });
    }
  }, [formData, setFormData, MAX_TIMESTAMP_RANGES]);


  return (
    <div className="w-layout-hflex c-type-wrapper">
      <div data-current="부분 녹취" data-easing="ease" data-duration-in="300" data-duration-out="100" className="tabs-993 w-tabs">
        <div className="tabs-menu w-tab-menu" style={{ display: 'flex', gap: '0' }}>
          <button
            data-w-tab="전체 녹취"
            className={`c-button-type left w-inline-block w-tab-link ${formData.recordType === '전체' ? 'w--current' : ''}`}
            onClick={() => setFormData({ ...formData, recordType: '전체' })}
            style={{
              backgroundColor: formData.recordType === '전체' ? '#374151' : 'white',
              color: formData.recordType === '전체' ? 'white' : '#374151',
              border: formData.recordType === '전체' ? '1.5px solid #374151' : '1px solid #374151',
              borderRadius: '0',
              padding: '15px 30px',
              fontSize: '14px',
              fontWeight: formData.recordType === '전체' ? '700' : '500',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div>전체 녹취</div>
          </button>
          <button
            data-w-tab="부분 녹취"
            className={`c-button-type right w-inline-block w-tab-link ${formData.recordType === '부분' ? 'w--current' : ''}`}
            onClick={() => setFormData({ ...formData, recordType: '부분' })}
            style={{
              backgroundColor: formData.recordType === '부분' ? '#374151' : 'white',
              color: formData.recordType === '부분' ? 'white' : '#374151',
              border: formData.recordType === '부분' ? '1.5px solid #374151' : '1px solid #374151',
              borderLeft: formData.recordType === '부분' ? '1.5px solid #374151' : 'none',
              borderRadius: '0',
              padding: '15px 30px',
              fontSize: '14px',
              fontWeight: formData.recordType === '부분' ? '700' : '500',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div>부분 녹취</div>
          </button>
        </div>
        
        {formData.recordType === '부분' && (
          <div className="w-tab-content" style={{ marginTop: '0.5rem', paddingBottom: '0.5rem' }}>
            <div data-w-tab="부분 녹취" className="w-tab-pane w--tab-active">
              <div className="c-timestamp-block" style={{ marginBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <h2 className="c-file-block-heading h5" style={{ textAlign: 'left', margin: '0' }}>부분 녹취 구간 입력</h2>
                  {(formData.timestampRanges?.length || 0) < MAX_TIMESTAMP_RANGES && (
                    <button
                      type="button"
                      onClick={handleTimestampRangeAdd}
                      style={{
                        background: 'none',
                        border: '1.5px solid #3b82f6',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#3b82f6',
                        fontWeight: '500'
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span>
                      <span>추가</span>
                    </button>
                  )}
                </div>
                
                {/* 파일 총 길이 초과 경고 */}
                {durationExceeded && fileDuration && (
                  <div style={{
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>⚠️</span>
                      <div style={{ fontSize: '13px', color: '#dc2626', lineHeight: '1.5' }}>
                        <strong>입력한 구간이 영상 길이를 벗어났습니다.</strong>
                        <div style={{ marginTop: '4px' }}>
                          • 파일 총 길이: {fileDuration}
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#991b1b' }}>
                          구간의 시작/종료 시간은 파일 총 길이 범위 내에 있어야 합니다.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="w-layout-vflex timestampt-input-wrapper" style={{ alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0' }}>
                  {(formData.timestampRanges || []).map((range, index) => (
                    <TimestampInput
                      key={`${range.id}-${index}`}
                      range={range}
                      onUpdate={(updatedRange) => handleTimestampRangeUpdate(index, updatedRange)}
                      onDelete={() => handleTimestampRangeDelete(index)}
                      canDelete={(formData.timestampRanges?.length || 0) > 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 