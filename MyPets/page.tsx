

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Plus, Edit, Trash, Upload, Calendar, Loader2 } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";

// Interface based on your API response
interface ApiPet {
  age: number | null;
  allergies: any[];
  breed: string;
  color: string;
  createdAt: string;
  gender: string;
  isActive: boolean;
  medicalHistory: any[];
  medications: any[];
  microchipId: string | null;
  name: string;
  notes: string;
  ownerId: string;
  petId: string;
  profileImageUrl: string;
  species: string;
  updatedAt: string;
  vaccinations: any[];
  weight: number;
}

// Interface for form data
interface PetFormData {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  color: string;
  medicalConditions: string;
  microchipNumber: string;
  photoUrl: string | ArrayBuffer | null;
}

// API functions - FIXED VERSION with proper payload structure
const updatePet = async (petId: string, updates: any) => {
  try {
    console.log('Sending update for pet:', petId, 'Updates:', updates);

    // Transform updates to avoid reserved keywords
    const transformedUpdates: any = {};

    // Handle reserved keywords by mapping them
    Object.keys(updates).forEach(key => {
      if (key === 'name') {
        transformedUpdates['#name'] = updates[key]; 
      } else {
        transformedUpdates[key] = updates[key];
      }
    });

    // If we have a reserved keyword, we need to send it differently
    const payload = updates;

    console.log('Transformed payload:', payload);

    const response = await api.put(`/pets/${petId}`, payload);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    // console.error('Update pet error:', error.response?.data || error.message);
    // throw error;
  }
};

const deletePet = async (petId: string) => {
  try {
    console.log('Deleting pet:', petId);
    const response = await api.delete(`/pets/${petId}`);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Delete pet error:', error.response?.data || error.message);
    throw error;
  }
};

export default function PetsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [deletePetId, setDeletePetId] = useState<string | null>(null);
  const [pets, setPets] = useState<ApiPet[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state for data fetching

  // NEW STATE FOR VIEWING PET DETAILS
  const [viewingPet, setViewingPet] = useState<ApiPet | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    dateOfBirth: "",
    gender: "",
    weight: "",
    color: "",
    medicalConditions: "",
    microchipNumber: "",
    photoUrl: "",
  });

  const getUserPets = async () => {
    try {
      const response = await api.get('/pets');
      return response.data;
    } catch (error) {
      // console.error('Get pets error:', error);
      // throw error;
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true); // Start loading
      try {
        const result = await getUserPets();
       
        // Handle different response structures
        if (Array.isArray(result)) {
          setPets(result);
        } else if (result.pets && Array.isArray(result.pets)) {
          setPets(result.pets);
        } else if (result.data && Array.isArray(result.data)) {
          setPets(result.data);
        } else {
          console.warn('Unexpected API response structure:', result);
          setPets([]);
        }
      } catch (error) {
        // console.error('Failed to fetch pets:', error);
        toast.error('Failed to load pets');
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchPets();
  }, []);

  const calculateAge = (pet: ApiPet) => {
    if (pet.age !== null && pet.age !== undefined) {
      return `${pet.age} years`;
    }

    return "Age not specified";
  };

  // Format medical conditions for display
  const getMedicalConditions = (pet: ApiPet) => {
    if (pet.medicalHistory && pet.medicalHistory.length > 0) {
      return pet.medicalHistory.map(history => history.condition || history).join(", ");
    }
    if (pet.notes) {
      return pet.notes;
    }
    if (pet.allergies && pet.allergies.length > 0) {
      return `Allergies: ${pet.allergies.join(", ")}`;
    }
    return "No medical conditions recorded";
  };

  // NEW FUNCTION TO HANDLE VIEW DETAILS
  const handleViewDetails = (pet: ApiPet) => {
    setViewingPet(pet);
    setDetailsModalOpen(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        setFormData({
          ...formData,
          photoUrl: reader.result,
        });
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const token = localStorage.getItem('idToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://a53r9ahdsk.execute-api.us-east-2.amazonaws.com/prod/pets/upload-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // SHOW REQUIREMENT ONLY FOR NEW PET CREATION
      // For update, all fields are optional
      if (!editingPetId) {
        // For new pet creation, check all required fields
        if (!formData.name || !formData.species || !formData.breed || !formData.dateOfBirth || !formData.gender || !formData.weight || !formData.color) {
          toast.error('Please fill all required fields');
          setIsSubmitting(false);
          return;
        }
      }
      // For update: no field is required, user can update any field they want

      let photoUrl = '';

      if (selectedFile) {
        toast.loading('Getting upload URL...', { id: 'upload' });

        try {
          const fileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`;
          const fileType = selectedFile.type;

          const presignedData = await getPresignedUrl(fileName, fileType);

          if (!presignedData.uploadUrl || !presignedData.photoUrl) {
            throw new Error('Invalid response from server');
          }

          toast.loading('Uploading image to S3...', { id: 'upload' });
          await uploadToS3(presignedData.uploadUrl, selectedFile, fileType);

          photoUrl = presignedData.photoUrl;

          toast.dismiss('upload');
          toast.success('Photo uploaded successfully!');

        } catch (uploadError: any) {
          toast.dismiss('upload');
          console.error('Upload error:', uploadError);
          toast.error(`Photo upload failed: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare update data - only include fields that have values
      const petData: any = {};

      // Only add fields that have values
      if (formData.name) petData.name = formData.name;
      if (formData.species) petData.species = formData.species;
      if (formData.breed) petData.breed = formData.breed;
      if (formData.gender) petData.gender = formData.gender;

      // For weight, only include if it has a value
      if (formData.weight && formData.weight.trim() !== '') {
        petData.weight = parseFloat(formData.weight) || 0;
      }

      // For color, only include if it has a value
      if (formData.color) petData.color = formData.color;

      // For notes, only include if it has a value
      if (formData.medicalConditions) {
        petData.notes = formData.medicalConditions;
      }

      // If dateOfBirth is provided, calculate age
      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        petData.age = age;
      }

      // For microchip number, include even if empty (to clear it if needed)
      if (formData.microchipNumber !== undefined) {
        petData.microchipId = formData.microchipNumber || null;
      }

      if (photoUrl) {
        petData.profileImageUrl = photoUrl;
      } else if (editingPetId && formData.photoUrl && typeof formData.photoUrl === 'string' && formData.photoUrl.startsWith('http')) {
        petData.profileImageUrl = formData.photoUrl;
      }

      console.log('Submitting pet data:', petData);

      if (editingPetId) {
        // Only send update if there's data to update
        if (Object.keys(petData).length > 0) {
          try {
            await updatePet(editingPetId, petData);
            toast.success('Pet updated successfully');
          } catch (updateError: any) {
            // If update fails due to reserved keyword, try alternative field name
            if (updateError.response?.data?.error?.includes('reserved keyword')) {
              console.log('Trying alternative field name for "name"');
              // Try with different field name
              const altPetData = { ...petData };
              // Remove the problematic field or rename it
              // Note: This depends on what your backend expects
              if (altPetData.name) {
                delete altPetData.name;
                altPetData.petName = formData.name; // Try alternative name
              }

              await updatePet(editingPetId, altPetData);
              toast.success('Pet updated successfully');
            } else {
              throw updateError;
            }
          }
        } else {
          toast.error('No changes to update');
        }
      } else {
        // For creating new pet - all required fields should already be validated
        const createPayload = {
          ...petData,
          isActive: true
        };

        const response = await api.post('/pets', createPayload);
        console.log('Pet created:', response.data);
        toast.success('Pet created successfully');
      }

      // Refresh pets list
      setIsLoading(true); // Start loading when refreshing
      const result = await getUserPets();
      if (Array.isArray(result)) {
        setPets(result);
      } else if (result.pets && Array.isArray(result.pets)) {
        setPets(result.pets);
      } else if (result.data && Array.isArray(result.data)) {
        setPets(result.data);
      }

      // Reset form
      setFormData({
        name: "",
        species: "",
        breed: "",
        dateOfBirth: "",
        gender: "",
        weight: "",
        color: "",
        medicalConditions: "",
        microchipNumber: "",
        photoUrl: ""
      });
      setSelectedFile(null);
      setEditingPetId(null);
      setOpenModal(false);

    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.dismiss('upload');

      // Provide more specific error messages
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (errorData.error?.includes('reserved keyword')) {
          toast.error('Field name conflict. Please contact support.');
        } else if (status === 500) {
          toast.error('Server error. Please check the data format or try again later.');
        } else if (status === 400) {
          toast.error(`Bad request: ${errorData.message || 'Invalid data format'}`);
        } else if (status === 404) {
          toast.error('Pet not found');
        } else {
          toast.error(`Error: ${errorData.message || error.message}`);
        }
      } else {
        toast.error(error.message || 'Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (pet: ApiPet) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      dateOfBirth: "", // API doesn't provide dateOfBirth directly
      gender: pet.gender,
      weight: pet.weight?.toString() || "",
      color: pet.color || "", // Ensure color is never undefined
      medicalConditions: pet.notes || "",
      microchipNumber: pet.microchipId || "",
      photoUrl: pet.profileImageUrl || "",
    });
    setSelectedFile(null);
    setEditingPetId(pet.petId);
    setOpenModal(true);
  };

  const handleDeleteClick = (id: string) => setDeletePetId(id);

  const confirmDelete = async () => {
    if (deletePetId !== null) {
      try {
        // Use the deletePet function
        await deletePet(deletePetId);
        setPets(pets.filter(p => p.petId !== deletePetId));
        toast.success('Pet deleted successfully');
        setDeletePetId(null);
      } catch (error: any) {
        console.error('Delete error:', error);
        if (error.response?.status === 500) {
          toast.error('Server error while deleting pet');
        } else {
          toast.error('Failed to delete pet');
        }
      }
    }
  };

  const clearPhoto = () => {
    setFormData({ ...formData, photoUrl: "" });
    setSelectedFile(null);
  };

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-lg md:text-xl font-semibold">My PETS</h1>
        <button
          className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer text-sm md:text-base disabled:bg-emerald-300 disabled:cursor-not-allowed"
          onClick={() => {
            setFormData({
              name: "",
              species: "",
              breed: "",
              dateOfBirth: "",
              gender: "",
              weight: "",
              color: "",
              medicalConditions: "",
              microchipNumber: "",
              photoUrl: ""
            });
            setSelectedFile(null);
            setEditingPetId(null);
            setOpenModal(true);
          }}
          disabled={isSubmitting}
        >
          <Plus size={16} /> Add New Pet
        </button>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-lg shadow-lg border">
          <div className="text-sm font-medium mb-2">Uploading Image... {uploadProgress}%</div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Loading pets...</p>
          <p className="text-gray-400 text-xs mt-1">Please wait while we fetch your pets</p>
        </div>
      ) : (
        /* PET GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {pets.map((pet) => (
            <div key={pet.petId} className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-2 md:gap-3">
                {pet.profileImageUrl ? (
                  <img
                    src={pet.profileImageUrl}
                    alt={pet.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-xs text-gray-500">${pet.name.charAt(0)}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{pet.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm md:text-lg">{pet.name}</p>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {pet.species} • {pet.breed} • {pet.color}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-2 md:mt-3 text-xs md:text-sm">
                <span className="text-emerald-500 font-medium">{calculateAge(pet)}</span>
                <span className="text-emerald-500 font-medium">{pet.weight} lbs</span>
              </div>

              <div className="mt-2 md:mt-3">
                <p className="text-gray-600 text-xs md:text-sm">
                  <span className="font-semibold block">Medical Information</span>
                  <span className="line-clamp-2">
                    {getMedicalConditions(pet)}
                  </span>
                </p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <button
                  className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-xs md:text-sm hover:bg-blue-100"
                  onClick={() => handleViewDetails(pet)}
                >
                  View Details
                </button>
                <div className="flex gap-2 md:gap-3">
                  <Edit
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    size={16}
                    onClick={() => handleEdit(pet)}
                  />
                  <Trash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    size={16}
                    onClick={() => handleDeleteClick(pet.petId)}
                  />
                </div>
              </div>
            </div>
          ))}

          {pets.length === 0 && (
            <div className="col-span-full text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No pets found</p>
              <p className="text-gray-400 text-sm mb-4">Add your first pet to get started</p>
              <button
                className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer mx-auto"
                onClick={() => setOpenModal(true)}
              >
                <Plus size={16} /> Add Your First Pet
              </button>
            </div>
          )}
        </div>
      )}

      {/* PET DETAILS MODAL */}
      {detailsModalOpen && viewingPet && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setDetailsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl p-4 md:p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 md:top-3 md:right-3 text-gray-500 text-sm hover:bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center"
                onClick={() => setDetailsModalOpen(false)}
              >
                ✕
              </button>

              <h2 className="text-lg md:text-xl font-semibold mb-4">Pet Details</h2>

              {/* Pet Profile Section */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                {viewingPet.profileImageUrl ? (
                  <img
                    src={viewingPet.profileImageUrl}
                    alt={viewingPet.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-emerald-100"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center border-2 border-emerald-100">
                    <span className="text-2xl text-gray-500">{viewingPet.name.charAt(0)}</span>
                  </div>
                )}

                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{viewingPet.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base mt-1">
                    {viewingPet.species} • {viewingPet.breed}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
                      {viewingPet.gender}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {calculateAge(viewingPet)}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                      {viewingPet.weight} lbs
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Species</span>
                      <p className="font-medium">{viewingPet.species}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Breed</span>
                      <p className="font-medium">{viewingPet.breed}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Color</span>
                      <p className="font-medium">{viewingPet.color}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Health Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Weight</span>
                      <p className="font-medium">{viewingPet.weight} lbs</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Microchip ID</span>
                      <p className="font-medium">{viewingPet.microchipId || "Not available"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status</span>
                      <p className={`font-medium ${viewingPet.isActive ? 'text-emerald-600' : 'text-gray-600'}`}>
                        {viewingPet.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Medical Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{getMedicalConditions(viewingPet)}</p>
                </div>
              </div>

              {/* Allergies */}
              {viewingPet.allergies && viewingPet.allergies.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingPet.allergies.map((allergy, index) => (
                      <span key={index} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vaccinations */}
              {viewingPet.vaccinations && viewingPet.vaccinations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Vaccinations</h4>
                  <div className="space-y-2">
                    {viewingPet.vaccinations.map((vaccine, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-sm">{vaccine.name || "Vaccination"}</p>
                        {vaccine.date && (
                          <p className="text-xs text-gray-500 mt-1">Date: {vaccine.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {viewingPet.medications && viewingPet.medications.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Medications</h4>
                  <div className="space-y-2">
                    {viewingPet.medications.map((medication, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-sm">{medication.name || "Medication"}</p>
                        {medication.dosage && (
                          <p className="text-xs text-gray-500 mt-1">Dosage: {medication.dosage}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-4 border-t text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Created: {new Date(viewingPet.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(viewingPet.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleEdit(viewingPet);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Edit size={16} /> Edit Pet
                </button>
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PET FORM MODAL */}
      {openModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => !isSubmitting && setOpenModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white w-full max-w-md md:max-w-2xl rounded-xl p-4 md:p-5 shadow-lg relative">
              <button
                className="absolute top-2 right-2 md:top-3 md:right-3 text-gray-500 text-sm hover:bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center disabled:cursor-not-allowed"
                onClick={() => !isSubmitting && setOpenModal(false)}
                disabled={isSubmitting}
              >
                ✕
              </button>
              <h2 className="text-lg md:text-xl font-semibold mb-3">{editingPetId ? "Edit Pet" : "Create New Pet"}</h2>

              {/* Photo Upload Section */}
              <div className="flex flex-col items-center mb-3">
                {formData.photoUrl ? (
                  <div className="relative">
                    <img src={formData.photoUrl as string} alt="Pet" className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-2 object-cover border" />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Photo</span>
                  </div>
                )}
                <label className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm ${isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 cursor-pointer hover:text-blue-700'}`}>
                  <Upload size={14} /> Upload Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Max 5MB • JPEG, PNG, GIF, WebP</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Pet Name */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Pet Name {!editingPetId && "*"}
                  </label>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter pet name"
                    required={!editingPetId} // Only required for new pets
                    disabled={isSubmitting}
                  />
                </div>

                {/* Species */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Species {!editingPetId && "*"}
                  </label>
                  <select
                    name="species"
                    value={formData.species || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required={!editingPetId} // Only required for new pets
                    disabled={isSubmitting}
                  >
                    <option value="">Select Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Hamster">Hamster</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Breed */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Breed {!editingPetId && "*"}
                  </label>
                  <input
                    name="breed"
                    value={formData.breed || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter breed"
                    required={!editingPetId} // Only required for new pets
                    disabled={isSubmitting}
                  />
                </div>

                {/* Date of Birth */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Date of Birth {!editingPetId && "*"}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required={!editingPetId} // Only required for new pets
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Gender */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Gender {!editingPetId && "*"}
                  </label>
                  <div className="flex gap-2 mt-1">
                    {["Male", "Female", "Unknown"].map(g => (
                      <button
                        key={g}
                        type="button"
                        className={`px-3 py-1.5 md:px-4 md:py-2 border rounded-lg text-xs md:text-sm transition-colors ${formData.gender === g
                          ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => !isSubmitting && setFormData({ ...formData, gender: g })}
                        disabled={isSubmitting}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Weight (lbs) {!editingPetId && "*"}
                  </label>
                  <input
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., 10.5"
                    type="number"
                    step="0.1"
                    min="0"
                    required={!editingPetId} // Only required for new pets
                    disabled={isSubmitting}
                  />
                </div>

                {/* Color */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">
                    Color {!editingPetId && "*"}
                  </label>
                  <input
                    name="color"
                    value={formData.color || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Black, White, Brown"
                    required={!editingPetId} // Only required for new pets
                    disabled={isSubmitting}
                  />
                </div>

                {/* Microchip Number */}
                <div className="col-span-1">
                  <label className="text-xs md:text-sm font-medium block mb-1">Microchip Number</label>
                  <input
                    name="microchipNumber"
                    value={formData.microchipNumber || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Optional"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Medical Conditions - Full Width */}
                <div className="col-span-2">
                  <label className="text-xs md:text-sm font-medium block mb-1">Medical Conditions / Notes</label>
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 md:p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    rows={3}
                    placeholder="Describe any medical conditions, allergies, or special needs..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 md:gap-3 mt-4 md:mt-6 pt-4 border-t">
                <button
                  onClick={() => !isSubmitting && setOpenModal(false)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 md:px-4 md:py-2 border rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500 text-white rounded-lg text-xs md:text-sm hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingPetId ? "Updating..." : "Creating..."}
                    </>
                  ) : isUploading ? 'Uploading...' : editingPetId ? "Update Pet" : "Create Pet"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletePetId !== null && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setDeletePetId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-xl p-4 sm:p-5 shadow-lg text-sm sm:text-base">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Confirm Delete</h2>
              <p className="mb-4 sm:mb-6">Are you sure you want to delete this pet? This action cannot be undone.</p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setDeletePetId(null)}
                  className="px-3 py-1 sm:px-4 sm:py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}