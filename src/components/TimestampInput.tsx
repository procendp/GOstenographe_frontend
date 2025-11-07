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
      marginBottom: '1rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
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
            placeholder="00:00:00"
            className="c-input-text"
            style={{
              flex: '1',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              textAlign: 'center',
              fontFamily: 'Pretendard',
              color: range.error ? '#dc2626' : ((!startTime || startTime === '00:00:00') ? '#9ca3af' : '#374151')
            }}
          />
          <span style={{
            fontSize: '14px',
            color: '#6b7280',
            fontFamily: 'Pretendard'
          }}>-</span>
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
              flex: '1',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              textAlign: 'center',
              fontFamily: 'Pretendard',
              color: range.error ? '#dc2626' : ((!endTime || endTime === '00:00:00') ? '#9ca3af' : '#374151')
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#3b82f6',
                fontSize: '14px',
                textDecoration: 'underline',
                fontFamily: 'Pretendard'
              }}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {showWarning && range.error && (
        <p className="c-timestamp-warning" style={{
          fontFamily: 'Pretendard',
          color: '#dc2626',
          fontSize: '12px',
          margin: '8px 0 0 0',
          textAlign: 'left',
          fontWeight: '500'
        }}>
          {range.error}
        </p>
      )}
    </div>
  );
}