import React, { useState } from "react";
import { Upload, User } from "lucide-react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    full_name: "Nrb Nayon",
    email: "nayon@example.com",
    phone: "",
    bio: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Profile updated:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='p-6'>
      <div className='flex items-center space-x-3 mb-6'>
        <User className='w-6 h-6 text-gray-700' />
        <div>
          <h3 className='text-xl font-semibold text-gray-900'>
            Profile Settings
          </h3>
          <p className='text-gray-600'>Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Profile Picture */}
        <div className='flex items-center space-x-6'>
          <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center'>
            <User className='w-8 h-8 text-gray-500' />
          </div>
          <button
            type='button'
            className='flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <Upload className='w-4 h-4' />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Full Name
            </label>
            <input
              type='text'
              name='full_name'
              value={formData.full_name}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Phone
            </label>
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              placeholder='City, Country'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Bio
            </label>
            <textarea
              name='bio'
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder='Tell us about yourself...'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>
      </form>
    </div>
  );
}
