import React, { useState } from 'react';
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { toast } from 'react-toastify';
import locationService from '@/services/locationService';

interface CreateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLocationModal({ isOpen, onClose, onSuccess }: CreateLocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({
    latitude: '',
    longitude: ''
  });

  const validateCoordinates = (name: string, value: string) => {
    const num = parseFloat(value);
    if (name === 'latitude') {
      if (num < -90 || num > 90) {
        setErrors(prev => ({
          ...prev,
          latitude: 'Latitude must be between -90 and 90 degrees'
        }));
        return false;
      }
    } else if (name === 'longitude') {
      if (num < -180 || num > 180) {
        setErrors(prev => ({
          ...prev,
          longitude: 'Longitude must be between -180 and 180 degrees'
        }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'latitude' || name === 'longitude') {
      validateCoordinates(name, value);
    }
  };

  // Update handleSubmit to not require the event parameter
  const handleSubmit = async () => {
    // Validate before submission
    const isLatValid = validateCoordinates('latitude', formData.latitude);
    const isLongValid = validateCoordinates('longitude', formData.longitude);

    if (!isLatValid || !isLongValid) {
      toast.error('Please correct the coordinate values');
      return;
    }

    try {
      const locationData = {
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };
      
      await locationService.create(locationData);
      toast.success('Location created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error('Failed to create location');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 dark:bg-gray-800">
        <h4 className="font-semibold text-gray-800 mb-6 text-title-sm dark:text-white/90">
          Create New Location
        </h4>
        
        <div className="space-y-4">
          <div>
            <Label>Location Name <span className="text-error-500">*</span></Label>
            <Input
              type="text"
              name="name"
              defaultValue={formData.name}
              onChange={handleChange}
              placeholder="Enter location name"
              
            />
          </div>
          
          <div>
            <Label>Latitude <span className="text-error-500">*</span></Label>
            <Input
              type="number"
              name="latitude"
              defaultValue={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude (-90 to 90)"
              
            />
            {errors.latitude && (
              <span className="text-sm text-error-500">{errors.latitude}</span>
            )}
          </div>
          
          <div>
            <Label>Longitude <span className="text-error-500">*</span></Label>
            <Input
              type="number"
              name="longitude"
              defaultValue={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude (-180 to 180)"
              
            />
            {errors.longitude && (
              <span className="text-sm text-error-500">{errors.longitude}</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
          >
            Create Location
          </Button>
        </div>
      </div>
    </Modal>
  );
}