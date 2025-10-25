import { TimestampRange } from '@/types/reception';
import { validateTimestampRange, formatTimeInput } from '@/utils/timestampUtils';
import { useState, useEffect } from 'react';

interface TimestampInputProps {
  range: TimestampRange;
  onUpdate: (range: TimestampRange) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

export default function TimestampInput({ range, onUpdate, onDelete, canDelete = true }: TimestampInputProps) {
  const [startTime, setStartTime] = useState(range.startTime);
  const [endTime, setEndTime] = useState(range.endTime);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updatedRange = {
      ...range,
      startTime,
      endTime
    };
    
    const validation = validateTimestampRange(updatedRange);
    updatedRange.isValid = validation.isValid;
    updatedRange.error = validation.error;
    
    setShowWarning(!validation.isValid);
    onUpdate(updatedRange);
  }, [startTime, endTime, range.id]);

  const handleTimeChange = (value: string, type: 'start' | 'end') => {
    // Allow partial input while user is typing
    if (type === 'start') {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  const handleTimeBlur = (value: string, type: 'start' | 'end') => {
    // If empty, reset to empty string to show placeholder
    if (!value.trim()) {
      if (type === 'start') {
        setStartTime('');
      } else {
        setEndTime('');
      }
      return;
    }
    
    // Format the time when user finishes editing
    const formattedValue = formatTimeInput(value);
    if (type === 'start') {
      setStartTime(formattedValue);
    } else {
      setEndTime(formattedValue);
    }
  };

  return (
    <div className="w-layout-vflex c-timestamp-wrapper" style={{ 
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '0.5rem'
    }}>
      <div className="w-layout-hflex timestamp-h-flex" style={{ 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flex: '1'
      }}>
        <div className="c-time-input-grid" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flex: '1'
        }}>
          <div className="div-block-10" style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '4px',
              fontWeight: '500'
            }}>시작 시간</label>
            <input
              type="text"
              value={startTime || ''}
              onChange={(e) => handleTimeChange(e.target.value, 'start')}
              onFocus={(e) => {
                if (!startTime || startTime === '00:00:00') {
                  setStartTime('00:00:00');
                  setTimeout(() => e.target.select(), 0);
                }
              }}
              onBlur={(e) => handleTimeBlur(e.target.value, 'start')}
              placeholder="00:00:00"
              className="c-input-text"
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'Pretendard',
                color: range.error ? '#dc2626' : ((!startTime || startTime === '00:00:00') ? '#9ca3af' : '#374151'),
                fontSize: '14px',
                padding: '8px 12px'
              }}
            />
          </div>
          <div className="div-block-10" style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '4px',
              fontWeight: '500'
            }}>종료 시간</label>
            <input
              type="text"
              value={endTime || ''}
              onChange={(e) => handleTimeChange(e.target.value, 'end')}
              onFocus={(e) => {
                if (!endTime || endTime === '00:00:00') {
                  setEndTime('00:00:00');
                  setTimeout(() => e.target.select(), 0);
                }
              }}
              onBlur={(e) => handleTimeBlur(e.target.value, 'end')}
              placeholder="00:00:00"
              className="c-input-text"
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'Pretendard',
                color: range.error ? '#dc2626' : ((!endTime || endTime === '00:00:00') ? '#9ca3af' : '#374151'),
                fontSize: '14px',
                padding: '8px 12px'
              }}
            />
          </div>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="c-timestamp-delete"
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              padding: '6px 12px',
              fontFamily: 'Pretendard',
              color: 'white',
              fontSize: '12px',
              fontWeight: '500',
              flexShrink: 0,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            삭제
          </button>
        )}
      </div>
      {showWarning && range.error && (
        <p className="c-timestamp-warning" style={{
          fontFamily: 'Pretendard',
          color: '#dc2626',
          fontSize: '12px',
          margin: '0',
          textAlign: 'center',
          fontWeight: '500',
          padding: '4px 8px',
          backgroundColor: '#fef2f2',
          borderRadius: '4px',
          border: '1px solid #fecaca'
        }}>
          {range.error}
        </p>
      )}
    </div>
  );
}