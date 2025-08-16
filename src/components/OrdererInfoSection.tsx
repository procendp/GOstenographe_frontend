import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

import { ReceptionFormData } from '@/types/reception';

interface OrdererInfoSectionProps {
  formData: ReceptionFormData;
  setFormData: (data: ReceptionFormData) => void;
  onNext?: () => void;
}

export default function OrdererInfoSection({ formData, setFormData, onNext }: OrdererInfoSectionProps) {
  const handleChange = (field: keyof ReceptionFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 w-24 flex items-center">
            <FaUser className="mr-2" />
            이름
          </span>
          <input
            type="text"
            placeholder="이름 입력"
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 w-24 flex items-center">
            <FaPhone className="mr-2" />
            연락처
          </span>
          <input
            type="tel"
            placeholder="연락처 입력"
            value={formData.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 w-24 flex items-center">
            <FaEnvelope className="mr-2" />
            이메일
          </span>
          <input
            type="email"
            placeholder="이메일 입력"
            value={formData.customerEmail}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 w-24 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            주소
          </span>
          <input
            type="text"
            placeholder="주소 입력"
            value={formData.customerAddress}
            onChange={(e) => handleChange('customerAddress', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end">
        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
} 