import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/api';

interface Tag {
  id: number;
  name: string;
}

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const fetchTags = async () => {
    try {
      const response = await apiService.tags.getAll();
      setTags(response);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    try {
      await apiService.tags.create({ name: newTagName });
      setNewTagName('');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleUpdateTag = async () => {
    if (editingTag) {
      try {
        await apiService.tags.update(editingTag.id, { name: editingTag.name });
        setEditingTag(null);
        fetchTags();
      } catch (error) {
        console.error('Error updating tag:', error);
      }
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await apiService.tags.delete(tagId);
        fetchTags();
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Tag Management</h2>
      <div className="mb-6">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <button onClick={handleCreateTag} className="mt-2 inline-flex items-center justify-center rounded-md bg-black py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          Create Tag
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
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {editingTag && editingTag.id === tag.id ? (
                    <input
                      type="text"
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  ) : (
                    <p className="text-black dark:text-white">{tag.name}</p>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {editingTag && editingTag.id === tag.id ? (
                      <button onClick={handleUpdateTag} className="hover:text-primary">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => setEditingTag(tag)} className="hover:text-primary">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteTag(tag.id)} className="hover:text-primary">
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

export default TagManagement;
