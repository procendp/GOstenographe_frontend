import React from 'react';
import * as Icons from 'react-icons/fa';

interface Request {
  id: number;
  username: string;
  type: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
}

interface RequestListProps {
  requests?: Request[];
}

const RequestList: React.FC<RequestListProps> = ({ 
  requests = [] // 기본값으로 빈 배열 설정
}) => {
  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'completed':
        return React.createElement(Icons.FaCheckCircle, { className: "text-green-500" });
      case 'processing':
        return React.createElement(Icons.FaClock, { className: "text-yellow-500" });
      case 'failed':
        return React.createElement(Icons.FaExclamationCircle, { className: "text-red-500" });
    }
  };

  const getStatusText = (status: Request['status']) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '처리중';
      case 'failed':
        return '실패';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">최근 요청</h3>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">최근 요청이 없습니다.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">{request.username}</p>
                <p className="text-sm text-gray-500">{request.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(request.status)}
                <span className="text-sm">{getStatusText(request.status)}</span>
                <span className="text-sm text-gray-500">{request.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestList; 