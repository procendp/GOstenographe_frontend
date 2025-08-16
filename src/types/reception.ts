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
  timestamps: string[];
  recordType: '전체' | '부분';
} 