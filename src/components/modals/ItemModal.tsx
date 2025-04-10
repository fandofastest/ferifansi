import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import categoryService, { Category } from '@/services/categoryService';
import CategoryModal from './CategoryModal';
import SubCategoryModal from './SubCategoryModal';
import RateModal from './RateModal';
import Button from '../ui/button/Button';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ _id: string }>;
  onRateSuccess?: () => void;  // Add this prop
}

export default function ItemModal({ isOpen, onClose, onSubmit, onRateSuccess }: ItemModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await onSubmit({
        itemCode: formData.get('itemCode'),
        description: formData.get('description'),
        unitMeasurement: formData.get('unitMeasurement'),
        category: formData.get('category'),
        subCategory: formData.get('subCategory'),
      });
      setCreatedItemId(response._id);
      setIsRateModalOpen(true);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesData, subCategoriesData] = await Promise.all([
        categoryService.getAll(),
        categoryService.getSubCategories()
      ]);
      setCategories(categoriesData);
      setSubCategories(subCategoriesData);
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleCreateCategory = async (data: any) => {
    try {
      await categoryService.create(data);
      const newCategories = await categoryService.getAll();
      setCategories(newCategories);
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateSubCategory = async (data: any) => {
    try {
      await categoryService.createSubCategory(data);
      const newSubCategories = await categoryService.getSubCategories();
      setSubCategories(newSubCategories);
      setIsSubCategoryModalOpen(false);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      const subCategoriesData = await categoryService.getSubCategoriesByCategory(categoryId);
      setSubCategories(subCategoriesData);
    } else {
      setSubCategories([]);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create New Item</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Code</label>
              <input
                type="text"
                name="itemCode"
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                name="description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Measurement</label>
              <input
                type="text"
                name="unitMeasurement"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <button type="button" onClick={() => setIsCategoryModalOpen(true)} className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  + Add Category
                </button>
              </div>
              <select 
                name="category" 
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                required
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Category</label>
                <button type="button" onClick={() => setIsSubCategoryModalOpen(true)} className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  + Add Sub Category
                </button>
              </div>
              <select 
                name="subCategory" 
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                required
                disabled={!selectedCategory}
              >
                <option value="">Select Sub Category</option>
                {subCategories.map(subCategory => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
              variant="outline"
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-3 py-1.5  text-white rounded-lg "
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <SubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        onSubmit={handleCreateSubCategory}
        categories={categories}
      />
      
      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          onClose();
        }}
        itemId={createdItemId}
        onSuccess={onRateSuccess}  // Pass the callback
      />
    </>
  );
}