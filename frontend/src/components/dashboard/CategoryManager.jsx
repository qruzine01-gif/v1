import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save,
  X,
  AlertCircle,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import apiService from '../../lib/api';
import { useMediaQuery } from 'react-responsive';

const CategoryManager = ({ resID, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, [resID]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories(resID);
      setCategories(response.data);
      setError(null);
      if (onCategoryChange) {
        onCategoryChange(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, isEditing = false) => {
    if (!file) return;

    try {
      setUploading(true);
      const response = await apiService.uploadImage(resID, file);
      
      if (isEditing) {
        setEditingCategory(prev => ({
          ...prev,
          image: response.data.url
        }));
      } else {
        setNewCategory(prev => ({
          ...prev,
          image: response.data.url
        }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        alert('Category name is required');
        return;
      }

      const response = await apiService.createCategory(resID, newCategory);
      setCategories(prev => [...prev, response.data]);
      resetForm();
      setShowAddCategory(false);
      if (onCategoryChange) {
        onCategoryChange([...categories, response.data]);
      }
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Failed to add category: ' + err.message);
    }
  };

  const updateCategory = async () => {
    try {
      if (!editingCategory.name.trim()) {
        alert('Category name is required');
        return;
      }

      const response = await apiService.updateCategory(resID, editingCategory.categoryID, editingCategory);
      setCategories(prev =>
        prev.map(cat =>
          cat.categoryID === editingCategory.categoryID ? response.data : cat
        )
      );
      setEditingCategory(null);
      if (onCategoryChange) {
        onCategoryChange(categories.map(cat =>
          cat.categoryID === editingCategory.categoryID ? response.data : cat
        ));
      }
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category: ' + err.message);
    }
  };

  const toggleCategoryStatus = async (categoryID) => {
    try {
      await apiService.toggleCategoryStatus(resID, categoryID);
      setCategories(prev =>
        prev.map(cat =>
          cat.categoryID === categoryID ? { ...cat, isActive: !cat.isActive } : cat
        )
      );
    } catch (err) {
      console.error('Error toggling category status:', err);
      alert('Failed to update category status: ' + err.message);
    }
  };

  const deleteCategory = async (categoryID) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    try {
      await apiService.deleteCategory(resID, categoryID);
      setCategories(prev => prev.filter(cat => cat.categoryID !== categoryID));
      if (onCategoryChange) {
        onCategoryChange(categories.filter(cat => cat.categoryID !== categoryID));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category: ' + err.message);
    }
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      description: '',
      image: '',
      sortOrder: 0
    });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          {isMobile && (
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {!isMobile && (
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm sm:text-base"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category.categoryID}
            className="bg-white rounded-lg shadow-sm sm:shadow-md p-3 sm:p-4 border border-gray-100 sm:border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate max-w-[70%]">
                {category.name}
              </h4>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => toggleCategoryStatus(category.categoryID)}
                  className="p-1.5 sm:p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title={category.isActive ? 'Hide Category' : 'Show Category'}
                  aria-label={category.isActive ? 'Hide Category' : 'Show Category'}
                >
                  {category.isActive ? (
                    <Eye className="h-4 w-4 sm:h-4 sm:w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 sm:h-4 sm:w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-1.5 sm:p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit Category"
                  aria-label="Edit Category"
                >
                  <Edit className="h-4 w-4 sm:h-4 sm:w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => deleteCategory(category.categoryID)}
                  className="p-1.5 sm:p-1.5 rounded-full hover:bg-red-50 transition-colors text-red-600"
                  title="Delete Category"
                  aria-label="Delete Category"
                >
                  <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            {category.image && (
              <div className="mb-2 sm:mb-3 h-24 sm:h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2">
              {category.description || 'No description provided'}
            </p>
            <div className="text-xs text-gray-400">
              Sort Order: {category.sortOrder}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddCategory || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setEditingCategory(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 p-1 -mr-1"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory?.name || newCategory.name}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, name: e.target.value })
                        : setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Appetizers, Main Course"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingCategory?.description || newCategory.description}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, description: e.target.value })
                        : setNewCategory({ ...newCategory, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {(editingCategory?.image || newCategory.image) ? (
                        <img
                          src={editingCategory?.image || newCategory.image}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-full w-full text-gray-300 p-2" />
                      )}
                    </span>
                    <label className="ml-3 sm:ml-4">
                      <div className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors">
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleImageUpload(e.target.files[0], !!editingCategory)}
                          accept="image/*"
                        />
                        {uploading ? 'Uploading...' : 'Change'}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingCategory?.sortOrder ?? newCategory.sortOrder}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, sortOrder: value });
                      } else {
                        setNewCategory({ ...newCategory, sortOrder: value });
                      }
                    }}
                    className="w-20 sm:w-24 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 space-y-reverse sm:space-x-3 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategory(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editingCategory ? updateCategory : addCategory}
                    disabled={uploading || loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        <span className="truncate">Saving...</span>
                      </>
                    ) : editingCategory ? (
                      'Update Category'
                    ) : (
                      'Add Category'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
