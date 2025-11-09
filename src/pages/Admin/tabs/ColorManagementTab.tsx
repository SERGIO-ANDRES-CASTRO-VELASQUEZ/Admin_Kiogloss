import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/api';

interface Color {
  id: number;
  name: string;
}

const ColorManagementTab: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  const fetchColors = async () => {
    try {
      const response = await apiService.colors.getAll();
      setColors(response);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleCreateColor = async () => {
    try {
      await apiService.colors.create({ name: newColorName });
      setNewColorName('');
      fetchColors();
    } catch (error) {
      console.error('Error creating color:', error);
    }
  };

  const handleUpdateColor = async () => {
    if (editingColor) {
      try {
        await apiService.colors.update(editingColor.id, { name: editingColor.name });
        setEditingColor(null);
        fetchColors();
      } catch (error) {
        console.error('Error updating color:', error);
      }
    }
  };

  const handleDeleteColor = async (colorId: number) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      try {
        await apiService.colors.delete(colorId);
        fetchColors();
      } catch (error) {
        console.error('Error deleting color:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Color Management</h2>
      <div className="mb-6">
        <input
          type="text"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
          placeholder="New color name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <button onClick={handleCreateColor} className="mt-2 inline-flex items-center justify-center rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          Create Color
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
            {colors.map((color) => (
              <tr key={color.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {editingColor && editingColor.id === color.id ? (
                    <input
                      type="text"
                      value={editingColor.name}
                      onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  ) : (
                    <p className="text-black dark:text-white">{color.name}</p>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {editingColor && editingColor.id === color.id ? (
                      <button onClick={handleUpdateColor} className="hover:text-primary">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => setEditingColor(color)} className="hover:text-primary">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteColor(color.id)} className="hover:text-primary">
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

export default ColorManagementTab;
