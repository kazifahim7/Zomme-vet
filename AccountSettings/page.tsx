/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, ChangeEvent } from 'react';
import { User, Lock, Bell, LogOut, Edit2, Upload, Loader2, Save, X, Mail, Phone, MapPin, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  address: string | null;
  createdAt: string;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  preferences: {
    appointmentReminders: boolean;
    emailNotifications: boolean;
    prescriptionNotifications: boolean;
    smsNotifications: boolean;
  };
  timezone: string;
  updatedAt: string;
  userId: string;
  userType: string;
}

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    timezone: 'Asia/Dhaka'
  });

  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    prescriptionNotifications: true
  });

  // Get ID token from localStorage
  const getIdToken = () => {
    return localStorage.getItem('idToken');
  };

  // Fetch user profile data using direct fetch API
  const getUserProfile = async () => {
    try {
      setIsLoading(true);
      const idToken = getIdToken();

      if (!idToken) {
        toast.error('Please login to access your profile');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        'https://a53r9ahdsk.execute-api.us-east-2.amazonaws.com/prod/users/me',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();

      // Extract user data from response
      const fetchedUserData: UserProfile = data.user || data;

      if (!fetchedUserData) {
        throw new Error('No user data received');
      }

      console.log("Fetched user data:", fetchedUserData);
      setUserData(fetchedUserData);

      // Parse name into first and last name
      let firstName = '';
      let lastName = '';
      if (fetchedUserData.name) {
        const nameParts = fetchedUserData.name.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Populate form data with actual user data
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: fetchedUserData.email || '',
        phone: fetchedUserData.phoneNumber || '',
        address: fetchedUserData.address || '',
        timezone: fetchedUserData.timezone || 'Asia/Dhaka'
      });

      // Populate notifications from user preferences
      if (fetchedUserData.preferences) {
        setNotifications({
          appointmentReminders: fetchedUserData.preferences.appointmentReminders ?? true,
          emailNotifications: fetchedUserData.preferences.emailNotifications ?? true,
          smsNotifications: fetchedUserData.preferences.smsNotifications ?? false,
          prescriptionNotifications: fetchedUserData.preferences.prescriptionNotifications ?? true
        });
      }

      // Set profile image
      if (fetchedUserData.profileImage) {
        setProfileImageUrl(fetchedUserData.profileImage);
      } else {
        setProfileImageUrl(null);
      }

    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');

      // Set default state on error
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        timezone: 'Asia/Dhaka'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile using direct fetch API
  const updateUserProfile = async (updates: any) => {
    try {
      const idToken = getIdToken();

      if (!idToken) {
        toast.error('Please login to update your profile');
        window.location.href = '/login';
        throw new Error('No authentication token');
      }

      console.log('Sending update to server:', updates);

      const response = await fetch(
        'https://a53r9ahdsk.execute-api.us-east-2.amazonaws.com/prod/users/me',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Update failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      return data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle notification toggles
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImageUrl(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear profile image
  const clearProfileImage = () => {
    setProfileImageUrl(null);
    setSelectedFile(null);
  };

  // Get presigned URL for S3 upload
  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const idToken = getIdToken();
    if (!idToken) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://a53r9ahdsk.execute-api.us-east-2.amazonaws.com/prod/pets/upload-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: fileName,
        fileType: fileType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to get upload URL: ${response.status}`);
    }

    return await response.json();
  };

  // Upload to S3
  const uploadToS3 = async (uploadUrl: string, file: File, fileType: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(true);
          } else {
            reject(new Error(`S3 upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.onabort = () => reject(new Error('Upload was aborted'));

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', fileType);
        xhr.send(file);
      });
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (isSaving || isUploading) return;

    setIsSaving(true);
    try {
      let uploadedImageUrl = profileImageUrl;

      // Upload new image if selected
      if (selectedFile) {
        try {
          toast.loading('Uploading profile image...', { id: 'upload' });

          const fileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`;
          const fileType = selectedFile.type;

          const presignedData = await getPresignedUrl(fileName, fileType);

          if (!presignedData.uploadUrl || !presignedData.photoUrl) {
            throw new Error('Invalid response from server');
          }

          toast.loading('Uploading image to S3...', { id: 'upload' });
          await uploadToS3(presignedData.uploadUrl, selectedFile, fileType);

          uploadedImageUrl = presignedData.photoUrl;

          toast.dismiss('upload');
          toast.success('Profile image uploaded successfully!');

        } catch (uploadError: any) {
          toast.dismiss('upload');
          console.error('Upload error:', uploadError);
          toast.error(`Photo upload failed: ${uploadError.message}`);
          // Continue saving without image if upload fails
        }
      }

      // Prepare update data
      const updateData: any = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phone || null,
        address: formData.address || null,
        timezone: formData.timezone,
        preferences: notifications
      };

      // Add profile image if we have a URL and it's not a data URL
      if (uploadedImageUrl && !uploadedImageUrl.startsWith('data:')) {
        updateData.profileImage = uploadedImageUrl;
      }

      // Remove undefined or null values for clean partial update
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log('Sending profile update:', updateData);

      // Update profile
      const response = await updateUserProfile(updateData);

      // Update local state with the response data
      if (response && response.user) {
        const updatedUser = response.user;

        // Update userData state
        setUserData(updatedUser);

        // Update profile image URL from response
        if (updatedUser.profileImage) {
          setProfileImageUrl(updatedUser.profileImage);
        } else {
          setProfileImageUrl(null);
        }

        // Update form data with new values
        let firstName = '';
        let lastName = '';
        if (updatedUser.name) {
          const nameParts = updatedUser.name.trim().split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          phone: updatedUser.phoneNumber || '',
          address: updatedUser.address || '',
          timezone: updatedUser.timezone || 'Asia/Dhaka'
        }));

        // Update notifications from response
        if (updatedUser.preferences) {
          setNotifications({
            appointmentReminders: updatedUser.preferences.appointmentReminders,
            emailNotifications: updatedUser.preferences.emailNotifications,
            smsNotifications: updatedUser.preferences.smsNotifications,
            prescriptionNotifications: updatedUser.preferences.prescriptionNotifications
          });
        }
      }

      toast.success('Profile updated successfully!');

      // Reset selected file
      setSelectedFile(null);

    } catch (error: any) {
      console.error('Error saving changes:', error);

      if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Failed to save changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    window.location.href = "/";
    toast.success("Logging out...");
  };

  // Fetch user data on component mount
  useEffect(() => {
    getUserProfile();
  }, []);

  // Profile tab content
  const renderProfile = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {/* Profile Header with Data Info */}
      {userData && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-emerald-800">Profile Data Loaded</h3>
              <p className="text-sm text-emerald-600">
                Last updated: {new Date(userData.updatedAt).toLocaleDateString()} at {new Date(userData.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={getUserProfile}
              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 w-full md:w-auto"
              disabled={isLoading || isSaving}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <span>↻ Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Profile Image Upload Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {profileImageUrl ? (
            <>
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-emerald-100"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 border-4 border-emerald-100 flex items-center justify-center';
                    const firstName = formData.firstName || formData.email?.charAt(0) || 'U';
                    fallback.innerHTML = `<span class="text-2xl md:text-3xl text-gray-500 font-semibold">${firstName.charAt(0).toUpperCase()}</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
              <button
                onClick={clearProfileImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
                disabled={isSaving || isUploading}
                title="Remove photo"
              >
                <X size={10} />
              </button>
            </>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 border-4 border-emerald-100 flex items-center justify-center">
              <span className="text-2xl md:text-3xl text-gray-500 font-semibold">
                {(formData.firstName?.charAt(0) || formData.email?.charAt(0) || 'U').toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <label className={`mt-4 flex items-center justify-center gap-2 text-sm ${isSaving || isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 cursor-pointer hover:text-emerald-700'}`}>
          <Upload size={16} /> Upload Profile Photo
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isSaving || isUploading}
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">Max 5MB • JPEG, PNG, GIF, WebP</p>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Uploading Image...</span>
            <span className="text-sm font-semibold text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* User Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              disabled={isSaving || isUploading}
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              disabled={isSaving || isUploading}
              required
            />
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Primary email cannot be changed</p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              disabled={isSaving || isUploading}
            />
          </div>
          {userData?.phoneNumber && (
            <p className="text-xs text-gray-500 mt-1">
              Current: {userData.phoneNumber}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              disabled={isSaving || isUploading}
            />
          </div>
          {userData?.address && (
            <p className="text-xs text-gray-500 mt-1">
              Current: {userData.address}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              placeholder="Asia/Dhaka"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
              disabled={isSaving || isUploading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your current timezone is used for appointment scheduling
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving || isUploading}
          className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Security tab content
  const renderSecurity = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
        <p className="text-gray-600">
          Password management is handled through Amazon Cognito. For security reasons,
          password changes must be done through the Cognito hosted UI.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800">Password Management</h4>
              <p className="text-sm text-yellow-700 mt-1">
                To change your password, please use the Cognito hosted UI. This ensures
                secure password management and compliance with security best practices.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Secure Authentication</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your authentication is securely managed by Amazon Cognito. All login
                sessions are encrypted and follow industry-standard security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Notifications tab content
  const renderNotifications = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h3>
        <p className="text-gray-600">
          Customize how and when you receive notifications from our platform.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-gray-700 font-medium">Email appointment reminders</span>
              <p className="text-sm text-gray-500 mt-1">
                Receive email reminders for upcoming appointments
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNotificationToggle('appointmentReminders')}
            disabled={isSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.appointmentReminders ? 'bg-emerald-500' : 'bg-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications.appointmentReminders ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-gray-700 font-medium">Email notifications</span>
              <p className="text-sm text-gray-500 mt-1">
                Receive general email updates and announcements
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNotificationToggle('emailNotifications')}
            disabled={isSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-gray-700 font-medium">SMS reminders</span>
              <p className="text-sm text-gray-500 mt-1">
                Receive SMS reminders for important updates
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNotificationToggle('smsNotifications')}
            disabled={isSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.smsNotifications ? 'bg-emerald-500' : 'bg-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications.smsNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <span className="text-gray-700 font-medium">Prescription notifications</span>
              <p className="text-sm text-gray-500 mt-1">
                Notifications about prescription renewals and updates
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNotificationToggle('prescriptionNotifications')}
            disabled={isSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.prescriptionNotifications ? 'bg-emerald-500' : 'bg-gray-300'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications.prescriptionNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Save Button for Notifications */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Notification Settings
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-700">Loading your profile...</h2>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ACCOUNT SETTINGS</h1>
            <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
          </div>
          {userData && (
            <div className="mt-2 md:mt-0 text-right">
              <p className="text-sm text-gray-600">
                User ID: <span className="font-mono text-gray-800 text-xs">{userData.userId}</span>
              </p>
              <p className="text-sm text-gray-600">
                Account Type: <span className="font-medium text-emerald-600 capitalize">{userData.userType}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left cursor-pointer ${activeTab === 'profile'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left cursor-pointer ${activeTab === 'security'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left cursor-pointer ${activeTab === 'notifications'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer border-t border-gray-100 mt-2 pt-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'notifications' && renderNotifications()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;