import { ReceptionFormData, TimestampRange } from '@/types/reception';
import { useState, useEffect, useCallback } from 'react';
import TimestampInput from './TimestampInput';
import { createEmptyTimestampRange, calculateTotalDuration } from '@/utils/timestampUtils';

interface RequestInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function RequestInfoSection({ formData, setFormData, onNext, onBack }: RequestInfoSectionProps) {
  const [totalDuration, setTotalDuration] = useState('00:00:00');
  const MAX_TIMESTAMP_RANGES = 3; // Configurable maximum

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
                <h2 className="c-file-block-heading h5" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>부분 녹취 구간 입력</h2>
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
                  
                  {/* Add button */}
                  {(formData.timestampRanges?.length || 0) < MAX_TIMESTAMP_RANGES && (
                    <div className="w-layout-hflex c-timestamp-wrapper">
                      <button
                        type="button"
                        onClick={handleTimestampRangeAdd}
                        className="w-layout-hflex timestamp-h-flex"
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0'
                        }}
                      >
                        <div className="c-time-add-btn-grid" style={{
                          border: '1.5px dashed #3b82f6',
                          borderRadius: '5px',
                          gridTemplateColumns: '1fr 1fr 1fr 1fr',
                          gridColumnGap: '0px',
                          gridRowGap: '0px',
                          placeItems: 'center stretch',
                          width: '100%',
                          maxWidth: '400px',
                          padding: '2px 0',
                          display: 'grid',
                          cursor: 'pointer',
                          backgroundColor: 'transparent'
                        }}>
                          <div className="c-button-add-text" style={{
                            gridColumnGap: '5px',
                            gridRowGap: '5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '5px',
                            display: 'flex',
                            color: '#3b82f6'
                          }}>
                            <div className="c-icon-image-wrapper">
                              <span style={{ 
                                fontSize: '16px', 
                                color: '#3b82f6',
                                minWidth: '16px',
                                maxWidth: '80%',
                                display: 'inline-block'
                              }}>+</span>
                            </div>
                            <p className="c-input-text" style={{ 
                              margin: 0, 
                              color: '#3b82f6',
                              fontSize: '14px'
                            }}>추가</p>
                          </div>
                        </div>
                      </button>
                    </div>
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