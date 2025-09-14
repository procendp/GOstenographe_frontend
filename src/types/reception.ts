export interface TimestampRange {
  id: string;
  startTime: string; // HH:MM:SS format
  endTime: string;   // HH:MM:SS format
  isValid: boolean;
  error?: string;
}

export interface ReceptionFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  speakerCount: number;
  speakerNames: string[];
  selectedDates: string[];
  detail: string;
  files: { file: File, file_key: string }[];
  timestamps: string[]; // Keep for backward compatibility
  timestampRanges: TimestampRange[]; // New timestamp ranges for partial recording
  recordType: '전체' | '부분';
} 