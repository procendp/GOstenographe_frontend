import { TimestampRange } from '@/types/reception';

/**
 * Validates if a time string is in HH:MM:SS format
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
  return timeRegex.test(time);
};

/**
 * Converts time string to seconds for comparison
 */
export const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Converts seconds back to HH:MM:SS format
 */
export const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validates a timestamp range
 */
export const validateTimestampRange = (range: TimestampRange): { isValid: boolean; error?: string } => {
  // If either time is empty, return as invalid but no error
  if (!range.startTime || !range.endTime || range.startTime === '' || range.endTime === '') {
    return { isValid: false, error: undefined };
  }
  
  // Check format
  if (!isValidTimeFormat(range.startTime)) {
    return { isValid: false, error: '시작 시간 형식이 올바르지 않습니다 (HH:MM:SS)' };
  }
  
  if (!isValidTimeFormat(range.endTime)) {
    return { isValid: false, error: '종료 시간 형식이 올바르지 않습니다 (HH:MM:SS)' };
  }

  // Check if start time is before end time
  const startSeconds = timeToSeconds(range.startTime);
  const endSeconds = timeToSeconds(range.endTime);
  
  if (startSeconds >= endSeconds) {
    return { isValid: false, error: '시작 시간이 종료 시간보다 늦을 수 없습니다.' };
  }

  return { isValid: true };
};

/**
 * Calculates total duration from timestamp ranges
 */
export const calculateTotalDuration = (ranges: TimestampRange[]): string => {
  let totalSeconds = 0;
  
  for (const range of ranges) {
    // Only calculate for ranges with both times filled
    if (range.startTime && range.endTime && 
        range.startTime !== '' && range.endTime !== '' &&
        isValidTimeFormat(range.startTime) && isValidTimeFormat(range.endTime)) {
      
      const startSeconds = timeToSeconds(range.startTime);
      const endSeconds = timeToSeconds(range.endTime);
      
      // Only add if start < end
      if (startSeconds < endSeconds) {
        totalSeconds += (endSeconds - startSeconds);
      }
    }
  }

  return secondsToTime(totalSeconds);
};

/**
 * Creates a new empty timestamp range
 */
export const createEmptyTimestampRange = (): TimestampRange => {
  return {
    id: `timestamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    startTime: '',
    endTime: '',
    isValid: false,
    error: undefined
  };
};

/**
 * Formats time input (ensures HH:MM:SS format)
 * Supports both "112233" and "11:22:33" input formats
 */
export const formatTimeInput = (value: string): string => {
  // Remove any non-digit characters except colons
  const cleaned = value.replace(/[^\d:]/g, '');
  
  // Check if input is pure numbers (like "112233")
  if (!cleaned.includes(':') && cleaned.length >= 4) {
    // Handle pure number input like "112233" -> "11:22:33"
    const digits = cleaned.padStart(6, '0'); // Ensure 6 digits
    const hours = Math.min(23, parseInt(digits.slice(0, 2), 10));
    const minutes = Math.min(59, parseInt(digits.slice(2, 4), 10));
    const seconds = Math.min(59, parseInt(digits.slice(4, 6), 10));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Handle colon-separated input like "11:22:33"
  const parts = cleaned.split(':');
  const formatted = parts.slice(0, 3).map((part, index) => {
    // Pad with zeros and limit to 2 digits
    const num = parseInt(part || '0', 10);
    if (index === 0) {
      // Hours: 0-23
      return Math.min(23, Math.max(0, num)).toString().padStart(2, '0');
    } else {
      // Minutes/Seconds: 0-59
      return Math.min(59, Math.max(0, num)).toString().padStart(2, '0');
    }
  });

  // Ensure we always have 3 parts
  while (formatted.length < 3) {
    formatted.push('00');
  }

  return formatted.join(':');
};