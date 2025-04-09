import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import itemService from '@/services/itemService';
import categoryService from '@/services/categoryService';
import CategoryModal from './CategoryModal';
import SubCategoryModal from './SubCategoryModal';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: any;
}

export default function EditItemModal({ isOpen, onClose, onSuccess, item }: EditItemModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(item?.category?._id || '');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (item && item.category && item.category._id) {
        setSelectedCategory(item.category._id);
        fetchSubCategories(item.category._id);
      }
    }
  }, [isOpen, item]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await categoryService.getSubCategoriesByCategory(categoryId);
      setSubCategories(response);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subCategoryValue = formData.get('subCategory') as string;
    
    try {
      await itemService.update(item._id, {
        itemCode: formData.get('itemCode') as string,
        description: formData.get('description') as string,
        unitMeasurement: formData.get('unitMeasurement') as string,
        category: formData.get('category') as string,
        subCategory: subCategoryValue || undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Item</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Code</label>
              <input
                type="text"
                name="itemCode"
                defaultValue={item?.itemCode}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={item?.description}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Measurement</label>
              <input
                type="text"
                name="unitMeasurement"
                defaultValue={item?.unitMeasurement}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  + Add New
                </button>
              </div>
              <select
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Category</label>
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(true)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                  disabled={!selectedCategory}
                >
                  + Add New
                </button>
              </div>
              <select
                name="subCategory"
                defaultValue={item?.subCategory?._id || ""}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const response = await categoryService.create(data);
            await fetchCategories();
            setSelectedCategory(response._id);
            setIsCategoryModalOpen(false);
            return response;
          } catch (error) {
            console.error('Error creating category:', error);
            throw error;
          }
        }}
      />

      <SubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        categories={categories}
        onSubmit={async (data) => {
          try {
            await categoryService.createSubCategory(data);
            await fetchSubCategories(selectedCategory);
            setIsSubCategoryModalOpen(false);
          } catch (error) {
            console.error('Error creating subcategory:', error);
          }
        }}
      />
    </>
  );
}