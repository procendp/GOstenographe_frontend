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
 * 확장된 검증: 파일 길이, 중복, 전체 구간 합산 체크
 */
export const validateTimestampRangeWithFile = (
  range: TimestampRange,
  fileDuration: string,
  allRanges?: TimestampRange[],
  currentIndex?: number
): { isValid: boolean; error?: string } => {
  // 1. 기본 검증 먼저 수행
  const basicValidation = validateTimestampRange(range);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  const startSeconds = timeToSeconds(range.startTime);
  const endSeconds = timeToSeconds(range.endTime);
  const fileDurationSeconds = timeToSeconds(fileDuration);

  // 2. 파일 길이 초과 검증 (가장 중요!)
  if (startSeconds > fileDurationSeconds) {
    return {
      isValid: false,
      error: `시작 시간이 파일 길이(${fileDuration})를 초과합니다`
    };
  }

  if (endSeconds > fileDurationSeconds) {
    return {
      isValid: false,
      error: `종료 시간이 파일 길이(${fileDuration})를 초과합니다`
    };
  }

  // 3. 0초 이상 검증 (음수 방지)
  if (startSeconds < 0 || endSeconds < 0) {
    return {
      isValid: false,
      error: '시간은 0초 이상이어야 합니다'
    };
  }

  // 4. 구간 중복 검증
  if (allRanges && allRanges.length > 0) {
    for (let i = 0; i < allRanges.length; i++) {
      // 자기 자신은 제외
      if (currentIndex !== undefined && i === currentIndex) {
        continue;
      }

      const otherRange = allRanges[i];

      // 다른 구간이 비어있으면 스킵
      if (!otherRange.startTime || !otherRange.endTime) {
        continue;
      }

      const otherStart = timeToSeconds(otherRange.startTime);
      const otherEnd = timeToSeconds(otherRange.endTime);

      // 겹침 체크: (start < otherEnd) && (end > otherStart)
      const isOverlapping = (startSeconds < otherEnd) && (endSeconds > otherStart);

      if (isOverlapping) {
        return {
          isValid: false,
          error: `다른 구간과 겹칩니다 (구간${i + 1}: ${otherRange.startTime}-${otherRange.endTime})`
        };
      }
    }
  }

  return { isValid: true };
};

/**
 * 전체 구간 합산이 파일 길이를 초과하는지 검증
 */
export const validateTotalDurationWithinFile = (
  ranges: TimestampRange[],
  fileDuration: string
): { isValid: boolean; error?: string } => {
  if (!ranges || ranges.length === 0) {
    return { isValid: true };
  }

  const fileDurationSeconds = timeToSeconds(fileDuration);

  // 모든 유효한 구간의 총 길이 계산
  let totalSeconds = 0;
  for (const range of ranges) {
    if (range.startTime && range.endTime && range.isValid !== false) {
      const start = timeToSeconds(range.startTime);
      const end = timeToSeconds(range.endTime);
      if (start < end) {
        totalSeconds += (end - start);
      }
    }
  }

  if (totalSeconds > fileDurationSeconds) {
    return {
      isValid: false,
      error: `모든 구간의 총 길이(${secondsToTime(totalSeconds)})가 파일 길이(${fileDuration})를 초과합니다`
    };
  }

  return { isValid: true };
};

/**
 * Calculates total duration from timestamp ranges
 */
export const calculateTotalDuration = (ranges: TimestampRange[]): string => {
  let totalSeconds = 0;

  if (!ranges || !Array.isArray(ranges)) {
    return '00:00:00';
  }

  for (const range of ranges) {
    if (range.startTime && range.endTime &&
        range.startTime !== '' && range.endTime !== '' &&
        isValidTimeFormat(range.startTime) && isValidTimeFormat(range.endTime)) {

      const startSeconds = timeToSeconds(range.startTime);
      const endSeconds = timeToSeconds(range.endTime);

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