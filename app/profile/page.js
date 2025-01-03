'use client'

import LoadingComponent from '@/components/LoadingComponent';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { translations } from '@/constants';

const provinces = [
  { id: 'punjab', name: 'Punjab' },
  { id: 'sindh', name: 'Sindh' },
  { id: 'kpk', name: 'Khyber Pakhtunkhwa' },
  { id: 'balochistan', name: 'Balochistan' },
  { id: 'gilgit_baltistan', name: 'Gilgit-Baltistan' },
  { id: 'azad_kashmir', name: 'Azad Kashmir' },
  { id: 'islamabad', name: 'Islamabad Capital Territory' },
];

const languages = [
  { id: 'en', name: 'English' },
  { id: 'ur', name: 'اردو' },
  {id: 'panjabi', name: 'پنجابی'},
  { id: 'pashto', name: 'پښتو'},
];

const citiesByProvince = {
  Punjab: [
    { id: 'lahore', name: 'Lahore - لاہور' },
    { id: 'faisalabad', name: 'Faisalabad - فیصل آباد' },
    { id: 'rawalpindi', name: 'Rawalpindi - راولپنڈی' },
    { id: 'gujranwala', name: 'Gujranwala - گوجرانوالہ' },
    { id: 'sialkot', name: 'Sialkot - سیالکوٹ' },
    { id: 'multan', name: 'Multan - ملتان' },
    { id: 'bahawalpur', name: 'Bahawalpur - بہاولپور' },
  ],
  Sindh: [
    { id: 'karachi', name: 'Karachi - کراچی' },
    { id: 'hyderabad', name: 'Hyderabad - حیدرآباد' },
    { id: 'sukkur', name: 'Sukkur - سکھر' },
    { id: 'larkana', name: 'Larkana - لاڑکانہ' },
    { id: 'mirpurkhas', name: 'Mirpur Khas - میرپور خاص' },
  ],
  'Khyber Pakhtunkhwa': [
    { id: 'peshawar', name: 'Peshawar - پشاور' },
    { id: 'abbottabad', name: 'Abbottabad - ایبٹ آباد' },
    { id: 'mardan', name: 'Mardan - مردان' },
    { id: 'swat', name: 'Swat - سوات' },
    { id: 'kohat', name: 'Kohat - کوہاٹ' },
  ],
  Balochistan: [
    { id: 'quetta', name: 'Quetta - کوئٹہ' },
    { id: 'gwadar', name: 'Gwadar - گوادر' },
    { id: 'khuzdar', name: 'Khuzdar - خضدار' },
    { id: 'loralai', name: 'Loralai - لورالائی' },
    { id: 'turbat', name: 'Turbat - تربت' },
  ],
  'Gilgit-Baltistan': [
    { id: 'gilgit', name: 'Gilgit - گلگت' },
    { id: 'skardu', name: 'Skardu - سکردو' },
    { id: 'hunza', name: 'Hunza - ہنزہ' },
    { id: 'chilas', name: 'Chilas - چلاس' },
  ],
  'Azad Kashmir': [
    { id: 'muzaffarabad', name: 'Muzaffarabad - مظفرآباد' },
    { id: 'mirpur', name: 'Mirpur - میرپور' },
    { id: 'bhimber', name: 'Bhimber - بھمبر' },
    { id: 'rawalakot', name: 'Rawalakot - راولاکوٹ' },
  ],
  'Islamabad Capital Territory': [
    { id: 'islamabad', name: 'Islamabad - اسلام آباد' },
  ],
};

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const { language, changeLanguage } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [newProfile, setNewProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile`);

        // Check if the response is okay
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Failed to fetch products");
        }

        // Parse the response JSON
        const { profile } = await response.json();

        setProfile(profile);
        setNewProfile(profile);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      let uploadedImageUrl = null;

      // Step 1: Upload the image only if profile_pic is a file
      if (newProfile.profile_pic && newProfile.profile_pic instanceof File) {
        const formData = new FormData();
        formData.append('files', newProfile.profile_pic);

        // Send the request to the image upload API
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        // Step 2: Get the uploaded image URL
        const { result } = await uploadResponse.json();
        uploadedImageUrl = result[0].url; // Assuming `result` contains the URL in an array
      }

      // Step 3: Update profile with the uploaded image URL (if applicable)
      const updateResponse = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProfile.name,
          phone: newProfile.phone,
          address: newProfile.address,
          profile_pic: uploadedImageUrl || newProfile.profile_pic, // Use uploaded URL if available, else keep the existing one
          city: newProfile.city,
          state: newProfile.state,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Step 4: Get the updated profile data
      const { profile: p } = await updateResponse.json();
      setProfile(p);
      setNewProfile(p);
      setIsEditing(false);

    } catch (err) {
      console.error(err);
    }
  };
  const handleProvinceChange = (e) => {
    setNewProfile((prevData) => ({
      ...prevData,
      state: e.target.value,
      city: '', // Reset city when province changes
    }));
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0]

    setNewProfile(prev => ({ ...prev, profile_pic: image }))
  };

  if (!profile || !newProfile)
    return <LoadingComponent />

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="bg-white rounded-2xl w-5/6 h-screen overflow-auto p-8 shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-blue-600">{translations[language].profile}</h1>
          <div className='flex gap-3'>
            {!isEditing && (
              <select
                name="language"
                value={language ?? 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
                disabled={isEditing}
                className="px-3 py-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}</select>
            )
            }
            {isEditing && (
              <button
                onClick={() => {
                  setNewProfile(profile);
                  setIsEditing(false);
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {translations[language].cancel}
              </button>
            )
            }
            <button
              onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? translations[language].saveChanges : translations[language].editProfile}
            </button>

          </div>
        </div>
        <div className='flex gap-6 my-8'>
          <div className="relative">
            <img
              src={
                newProfile.profile_pic instanceof File
                  ? URL.createObjectURL(newProfile.profile_pic)
                  : newProfile.profile_pic
              }
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full shadow-lg cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => document.getElementById('fileInput').click()}
            />
            <input
              type="file"
              id="fileInput"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              disabled={!isEditing}
            />
          </div>
          <div className='pt-5'>
            <h2 className="text-2xl font-bold text-gray-800">{newProfile.name}</h2>
            <p className="text-gray-600">{newProfile.email}</p>
          </div>
        </div>

        <div className="space-y-8">

          {/* Personal Information Section */}
          <div className="bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">{translations[language].personalInformation}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en' ? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].name}</label>
                <input
                  type="text"
                  name="name"
                  value={newProfile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en' ? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].phone}</label>
                <input
                  type="text"
                  name="phone"
                  value={newProfile.phone ?? ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en'? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].email}</label>
                <input
                  type="email"
                  name="email"
                  value={newProfile.email}
                  disabled
                  className="p-3 border border-gray-300 rounded-lg w-full"
                />
              </div>

            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white p-3">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">{translations[language].addressInformation}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-y-2 gap-x-6">
              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en' ? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].address}</label>
                <input
                  type="text"
                  name="address"
                  value={newProfile.address ?? ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en' ? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].province}</label>
                <select
                  name="state"
                  value={newProfile.state ?? ''}
                  onChange={handleProvinceChange}
                  disabled={!isEditing}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <label className={`text-gray-700 font-semibold w-full ${language !== 'en' ? 'flex justify-end text-xl' : 'text-lg'}`}>{translations[language].city}</label>
                <select
                  name="city"
                  value={newProfile.city ?? ''}
                  onChange={handleChange}
                  disabled={!isEditing || !newProfile.state}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select City</option>
                  {newProfile.state &&
                    citiesByProvince[newProfile.state]?.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
