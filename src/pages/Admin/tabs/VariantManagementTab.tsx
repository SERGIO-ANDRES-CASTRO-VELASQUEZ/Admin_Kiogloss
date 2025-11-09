import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/api';

interface Size {
  id: number;
  name: string;
}

const VariantManagementTab: React.FC = () => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  const fetchVariants = async () => {
    try {
      const response = await apiService.sizes.getAll();
      setVariants(response);
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleCreateVariant = async () => {
    try {
      await apiService.sizes.create({ name: newVariantName });
      setNewVariantName('');
      fetchVariants();
    } catch (error) {
      console.error('Error creating variant:', error);
    }
  };

  const handleUpdateVariant = async () => {
    if (editingVariant) {
      try {
        await apiService.sizes.update(editingVariant.id, { name: editingVariant.name });
        setEditingVariant(null);
        fetchVariants();
      } catch (error) {
        console.error('Error updating variant:', error);
      }
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await apiService.sizes.delete(variantId);
        fetchVariants();
      } catch (error) {
        console.error('Error deleting variant:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Variant Management</h2>
      <div className="mb-6">
        <input
          type="text"
          value={newVariantName}
          onChange={(e) => setNewVariantName(e.target.value)}
          placeholder="New variant name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <button onClick={handleCreateVariant} className="mt-2 inline-flex items-center justify-center rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          Create Variant
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
            {variants.map((variant) => (
              <tr key={variant.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {editingVariant && editingVariant.id === variant.id ? (
                    <input
                      type="text"
                      value={editingVariant.name}
                      onChange={(e) => setEditingVariant({ ...editingVariant, name: e.target.value })}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  ) : (
                    <p className="text-black dark:text-white">{variant.name}</p>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {editingVariant && editingVariant.id === variant.id ? (
                      <button onClick={handleUpdateVariant} className="hover:text-primary">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => setEditingVariant(variant)} className="hover:text-primary">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteVariant(variant.id)} className="hover:text-primary">
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

export default VariantManagementTab;
