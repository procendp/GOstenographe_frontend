import React from 'react';
import * as Icons from 'react-icons/fa';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface NotificationsProps {
  notifications?: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications = [] // 기본값으로 빈 배열 설정
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return React.createElement(Icons.FaCheck, { className: "text-green-500" });
      case 'error':
        return React.createElement(Icons.FaTimes, { className: "text-red-500" });
      default:
        return React.createElement(Icons.FaBell, { className: "text-blue-500" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">알림</h3>
        {notifications.length > 0 && (
          <button className="text-sm text-blue-500 hover:text-blue-600">
            모두 읽음 표시
          </button>
        )}
      </div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">새로운 알림이 없습니다.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 