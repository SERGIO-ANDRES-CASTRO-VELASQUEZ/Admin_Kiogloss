import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await apiService.users.getAll();
      setUsers(response); // Assuming the API returns an array of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    const action = newRole === 'Admin' ? 'grant admin privileges to' : 'revoke admin privileges from';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await apiService.users.updateRole(userId, newRole);
        fetchUsers();
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">User Management</h2>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.name}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.role}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => handleRoleChange(user.id, user.role)} className="hover:text-primary">
                      {user.role !== 'Admin' ? 'Make Admin' : 'Revoke Admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
