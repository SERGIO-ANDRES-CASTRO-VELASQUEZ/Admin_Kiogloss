import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/api';

interface Size {
  id: number;
  name: string;
}

const SizeManagement: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [newSizeName, setNewSizeName] = useState('');
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const fetchSizes = async () => {
    try {
      const response = await apiService.sizes.getAll();
      setSizes(response);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleCreateSize = async () => {
    try {
      await apiService.sizes.create({ name: newSizeName });
      setNewSizeName('');
      fetchSizes();
    } catch (error) {
      console.error('Error creating size:', error);
    }
  };

  const handleUpdateSize = async () => {
    if (editingSize) {
      try {
        await apiService.sizes.update(editingSize.id, { name: editingSize.name });
        setEditingSize(null);
        fetchSizes();
      } catch (error) {
        console.error('Error updating size:', error);
      }
    }
  };

  const handleDeleteSize = async (sizeId: number) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      try {
        await apiService.sizes.delete(sizeId);
        fetchSizes();
      } catch (error) {
        console.error('Error deleting size:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Size Management</h2>
      <div className="mb-6">
        <input
          type="text"
          value={newSizeName}
          onChange={(e) => setNewSizeName(e.target.value)}
          placeholder="New size name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <button onClick={handleCreateSize} className="mt-2 inline-flex items-center justify-center rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          Create Size
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {editingSize && editingSize.id === size.id ? (
                    <input
                      type="text"
                      value={editingSize.name}
                      onChange={(e) => setEditingSize({ ...editingSize, name: e.target.value })}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  ) : (
                    <p className="text-black dark:text-white">{size.name}</p>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {editingSize && editingSize.id === size.id ? (
                      <button onClick={handleUpdateSize} className="hover:text-primary">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => setEditingSize(size)} className="hover:text-primary">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteSize(size.id)} className="hover:text-primary">
                      Delete
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

export default SizeManagement;
