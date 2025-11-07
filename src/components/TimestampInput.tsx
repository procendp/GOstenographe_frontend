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
    <div style={{
      marginBottom: '0.75rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          maxWidth: '66.67%'
        }}>
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
            placeholder="시작"
            className="c-input-text"
            style={{
              width: '120px',
              padding: '6px 10px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'transparent',
              outline: 'none',
              textAlign: 'left',
              fontFamily: 'Pretendard',
              color: range.error ? '#dc2626' : ((!startTime || startTime === '00:00:00') ? '#9ca3af' : '#374151')
            }}
          />
          <span style={{
            fontSize: '16px',
            color: '#d1d5db',
            fontWeight: '300'
          }}>→</span>
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
            placeholder="종료"
            className="c-input-text"
            style={{
              width: '120px',
              padding: '6px 10px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'transparent',
              outline: 'none',
              textAlign: 'left',
              fontFamily: 'Pretendard',
              color: range.error ? '#dc2626' : ((!endTime || endTime === '00:00:00') ? '#9ca3af' : '#374151')
            }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            style={{ flexShrink: 0, marginLeft: '0.5rem' }}
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              color: '#3b82f6',
              fontFamily: 'Pretendard',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            삭제
          </button>
        )}
      </div>
      {showWarning && range.error && (
        <p style={{
          fontFamily: 'Pretendard',
          color: '#dc2626',
          fontSize: '14px',
          margin: '0.5rem 0 0 0',
          paddingLeft: '0'
        }}>
          {range.error}
        </p>
      )}
    </div>
  );
}