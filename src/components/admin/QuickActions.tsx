import React from 'react';
import * as Icons from 'react-icons/fa';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'upload',
      label: '파일 업로드',
      icon: React.createElement(Icons.FaUpload, { className: "w-6 h-6" }),
      onClick: () => console.log('Upload clicked'),
    },
    {
      id: 'download',
      label: '일괄 다운로드',
      icon: React.createElement(Icons.FaDownload, { className: "w-6 h-6" }),
      onClick: () => console.log('Download clicked'),
    },
    {
      id: 'clean',
      label: '정리',
      icon: React.createElement(Icons.FaTrash, { className: "w-6 h-6" }),
      onClick: () => console.log('Clean clicked'),
    },
    {
      id: 'settings',
      label: '설정',
      icon: React.createElement(Icons.FaCog, { className: "w-6 h-6" }),
      onClick: () => console.log('Settings clicked'),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">빠른 작업</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-blue-500">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 