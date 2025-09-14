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
    <div className="w-layout-hflex c-timestamp-wrapper" style={{ justifyContent: 'flex-start' }}>
      <div className="w-layout-hflex timestamp-h-flex" style={{ justifyContent: 'flex-start' }}>
        <div className="c-time-input-grid">
          <div className="div-block-10">
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
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--_concept-1---font-normal)',
                color: range.error ? '#dc2626' : ((!startTime || startTime === '00:00:00') ? 'var(--_concept-1---color-set-2--light-grey)' : 'var(--_concept-1---color-set-2--grey)'),
                fontSize: 'var(--_concept-1---font-size--pc_p-button)'
              }}
            />
          </div>
          <div className="c-icon-image-wrapper" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#6b7280',
            fontWeight: 'bold'
          }}>
            ~
          </div>
          <div className="div-block-10">
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
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--_concept-1---font-normal)',
                color: range.error ? '#dc2626' : ((!endTime || endTime === '00:00:00') ? 'var(--_concept-1---color-set-2--light-grey)' : 'var(--_concept-1---color-set-2--grey)'),
                fontSize: 'var(--_concept-1---font-size--pc_p-button)'
              }}
            />
          </div>
          <div className="c-apply-icon-image-wrapper">
            <img loading="lazy" src="images/Input-Affix.png" alt="" className="image-4" />
          </div>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="c-timestamp-delete"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              fontFamily: 'var(--_concept-1---font-normal)',
              color: 'var(--_concept-1---color-set-2--blue80)',
              fontSize: 'var(--_concept-1---font-size--pc_p-button)'
            }}
          >
            삭제
          </button>
        )}
      </div>
      {showWarning && range.error && (
        <p className="c-timestamp-warning" style={{
          fontFamily: 'var(--_concept-1---font-normal)',
          color: 'var(--_concept-1---color-set-2--orange)',
          fontSize: 'var(--_concept-1---font-size--pc_p-button)',
          margin: '0',
          marginTop: '4px'
        }}>
          {range.error}
        </p>
      )}
    </div>
  );
}