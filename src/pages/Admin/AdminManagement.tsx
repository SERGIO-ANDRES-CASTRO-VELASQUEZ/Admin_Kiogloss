import React, { useState } from 'react';
import UserManagementTab from './tabs/UserManagementTab';
import TagManagementTab from './tabs/TagManagementTab';
import VariantManagementTab from './tabs/VariantManagementTab';
import ColorManagementTab from './tabs/ColorManagementTab';

const AdminManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementTab />;
      case 'tags':
        return <TagManagementTab />;
      case 'variants':
        return <VariantManagementTab />;
      case 'colors':
        return <ColorManagementTab />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex border-b border-stroke dark:border-strokedark">
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'tags' ? 'border-b-2 border-primary text-primary' : ''}`}
          onClick={() => setActiveTab('tags')}
        >
          Tags
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'variants' ? 'border-b-2 border-primary text-primary' : ''}`}
          onClick={() => setActiveTab('variants')}
        >
          Variants
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${activeTab === 'colors' ? 'border-b-2 border-primary text-primary' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminManagement;
