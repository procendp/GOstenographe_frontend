import { ReceptionFormData, TimestampRange } from '@/types/reception';
import { useState, useEffect, useCallback, useMemo } from 'react';
import TimestampInput from './TimestampInput';
import { createEmptyTimestampRange, calculateTotalDuration } from '@/utils/timestampUtils';

interface RequestInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
  fileDuration?: string; // 파일 총 길이 추가
}

export default function RequestInfoSection({ formData, setFormData, onNext, onBack, fileDuration = '00:00:00' }: RequestInfoSectionProps) {
  const [totalDuration, setTotalDuration] = useState('00:00:00');
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
    if (formData.timestampRanges && Array.isArray(formData.timestampRanges)) {
      try {
        const duration = calculateTotalDuration(formData.timestampRanges);
        setTotalDuration(duration);
      } catch (error) {
        console.error('[RequestInfoSection] duration 계산 오류:', error);
        setTotalDuration('00:00:00');
      }
    }
  }, [formData.timestampRanges]);

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

  // Memoize timestampRanges to prevent infinite re-renders in TimestampInput
  const memoizedTimestampRanges = useMemo(() =>
    formData.timestampRanges || [],
    [JSON.stringify(formData.timestampRanges)]
  );

  return (
    <div className="w-layout-hflex c-type-wrapper">
      <div data-current="부분 녹취" data-easing="ease" data-duration-in="300" data-duration-out="100" className="tabs-993 w-tabs">
        {formData.recordType === '부분' && (
          <div className="w-tab-content" style={{ marginTop: '0', paddingBottom: '0' }}>
            <div data-w-tab="부분 녹취" className="w-tab-pane w--tab-active">
              <div className="c-timestamp-block" style={{ marginBottom: '0' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h2 className="c-file-block-heading h5" style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>부분 녹취 구간 입력</h2>
                </div>
                <div className="w-layout-vflex timestampt-input-wrapper" style={{ alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0' }}>
                  {(formData.timestampRanges || []).map((range, index) => (
                    <TimestampInput
                      key={`${range.id}-${index}`}
                      range={range}
                      onUpdate={(updatedRange) => handleTimestampRangeUpdate(index, updatedRange)}
                      onDelete={() => handleTimestampRangeDelete(index)}
                      canDelete={(formData.timestampRanges?.length || 0) > 1}
                      fileDuration={fileDuration}
                      allRanges={memoizedTimestampRanges}
                      currentIndex={index}
                    />
                  ))}
                  {(formData.timestampRanges?.length || 0) < MAX_TIMESTAMP_RANGES && (
                    <button
                      type="button"
                      onClick={handleTimestampRangeAdd}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px dashed #93c5fd',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#6b7280',
                        fontFamily: 'Pretendard',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#60a5fa';
                        e.currentTarget.style.color = '#374151';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#93c5fd';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <span style={{ fontSize: '18px', fontWeight: 'normal' }}>+</span>
                      <span>추가</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 