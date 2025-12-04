"use client";

import { useState, ChangeEvent } from "react";
import { Plus, Edit, Trash, Upload, Calendar } from "lucide-react";
import Image from "next/image";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  dob: string;
  age: string;
  weight: string;
  neutered: string;
  gender: string;
  conditions: string;
  photo?: string | ArrayBuffer | null;
}

export default function PetsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [deletePetId, setDeletePetId] = useState<number | null>(null);

  const [pets, setPets] = useState<Pet[]>([
    { id: 1, name: "Max", species: "Dog", breed: "British Shorthair", dob: "2020-05-10", age: "3 years", weight: "62 lbs", neutered: "YES", gender: "Male", conditions: "Has mild seasonal allergies during spring", photo: "" },
    { id: 2, name: "Bella", species: "Cat", breed: "Persian", dob: "2021-07-15", age: "2 years", weight: "10 lbs", neutered: "NO", gender: "Female", conditions: "None", photo: "" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    dob: "",
    weight: "",
    neutered: "",
    gender: "",
    conditions: "",
    photo: "" as string | ArrayBuffer | null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const diff = new Date().getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
  };

  const handleSubmit = () => {
    if (editingPetId) {
      setPets(pets.map(p => p.id === editingPetId ? { ...p, ...formData, age: calculateAge(formData.dob) } : p));
    } else {
      const newPet: Pet = { id: pets.length + 1, ...formData, age: calculateAge(formData.dob) };
      setPets([...pets, newPet]);
    }

    setFormData({ name: "", species: "", breed: "", dob: "", weight: "", neutered: "", gender: "", conditions: "", photo: "" });
    setEditingPetId(null);
    setOpenModal(false);
  };

  const handleEdit = (pet: Pet) => {
    setFormData({   name: pet.name,
    species: pet.species,
    breed: pet.breed,
    dob: pet.dob,
    weight: pet.weight,
    neutered: pet.neutered,
    gender: pet.gender,
    conditions: pet.conditions,
    photo: pet.photo ?? "",});
    setEditingPetId(pet.id);
    setOpenModal(true);
  };

  const handleDeleteClick = (id: number) => setDeletePetId(id);

  const confirmDelete = () => {
    if (deletePetId !== null) {
      setPets(pets.filter(p => p.id !== deletePetId));
      setDeletePetId(null);
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-lg md:text-xl font-semibold">My PETS</h1>
        <button
          className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer text-sm md:text-base"
          onClick={() => {
            setFormData({ name: "", species: "", breed: "", dob: "", weight: "", neutered: "", gender: "", conditions: "", photo: "" });
            setEditingPetId(null);
            setOpenModal(true);
          }}
        >
          <Plus size={16} /> Add New Pet
        </button>
      </div>

      {/* PET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {pets.map((p) => (
          <div key={p.id} className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-2 md:gap-3">
              {p.photo ? (
                <Image
                  src={p.photo as string}       
                  alt={p.name}                  
                  width={48}                     
                  height={48}                    
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300" />
              )}
              <div>
                <p className="font-semibold text-sm md:text-lg">{p.name}</p>
                <p className="text-gray-500 text-xs md:text-sm">{p.species} • {p.breed}</p>
              </div>
            </div>

            <div className="flex justify-between mt-2 md:mt-3 text-xs md:text-sm">
              <span className="text-emerald-500 font-medium">{p.age}</span>
              <span className="text-emerald-500 font-medium">{p.weight}</span>
            </div>

            <div className="mt-2 md:mt-3">
              <p className="text-gray-600 text-xs md:text-sm">
                <span className="font-semibold block">Medical Conditions</span>
                {p.conditions}
              </p>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <button className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-xs md:text-sm hover:bg-blue-100">
                View Details
              </button>
              <div className="flex gap-2 md:gap-3">
                <Edit className="text-blue-500 cursor-pointer" size={16} onClick={() => handleEdit(p)} />
                <Trash className="text-red-500 cursor-pointer" size={16} onClick={() => handleDeleteClick(p.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PET FORM MODAL */}
      {openModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setOpenModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white w-full max-w-md md:max-w-lg rounded-xl p-4 md:p-5 shadow-lg relative">
              <button className="absolute top-2 right-2 md:top-3 md:right-3 text-gray-500 text-sm" onClick={() => setOpenModal(false)}>✕</button>
              <h2 className="text-lg md:text-xl font-semibold mb-3">{editingPetId ? "Edit Pet" : "Create New Pet"}</h2>

              <div className="flex flex-col items-center mb-3">
                {formData.photo ? (
                  <Image
                  src={formData.photo as string}  
                  alt="Pet"                       
                  width={64}                       
                  height={64}                      
                  className="rounded-full mb-2 object-cover"
                />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 mb-2" />
                )}
                <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 cursor-pointer">
                  <Upload size={14} /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium">Pet Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                    placeholder="Pet name"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium">Species</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium">Breed</label>
                  <input
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                    />
                    <Calendar className="absolute right-2 top-2 md:top-2.5 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium">Weight (lbs)</label>
                  <input
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium mb-1 block">Neutered/Spayed</label>
                  <div className="flex gap-1 md:gap-2 mt-1">
                    {["YES", "NO"].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 border rounded-lg text-xs md:text-sm cursor-pointer ${
                          formData.neutered === n
                            ? " border-emerald-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => setFormData({ ...formData, neutered: n })}
                      >
                        {/* Round selector inside button */}
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            formData.neutered === n ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                          }`}
                        >
                          {formData.neutered === n && <span className="w-2 h-2 bg-white rounded-full"></span>}
                        </span>

                        <span>{n}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-full w-full">
                  <label className="text-xs md:text-sm font-medium mb-2 block">Gender</label>

                  <div className="flex gap-2 mt-1 w-full">
                    {["Male", "Female", "Unknown"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-xs md:text-sm cursor-pointer ${
                          formData.gender === g ? "border-emerald-500" : "border-gray-300"
                        }`}
                        onClick={() => setFormData({ ...formData, gender: g })}
                      >
                        {/* Round selector inside button */}
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.gender === g ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                          }`}
                        >
                          {formData.gender === g && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
                        </span>

                        <span>{g}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-xs md:text-sm font-medium">Medical Conditions</label>
                  <textarea
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    className="w-full border border-gray-100 rounded-lg p-1.5 md:p-2 mt-1 text-xs md:text-sm"
                    rows={2}
                    placeholder="Describe conditions..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 md:gap-3 mt-4 md:mt-6">
                <button className="px-3 py-1.5 md:px-4 md:py-2 text-red-500 border border-red-500 rounded-lg text-xs md:text-sm cursor-pointer" onClick={() => setOpenModal(false)}>
                  Cancel
                </button>
                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500 text-white rounded-lg text-xs md:text-sm cursor-pointer" onClick={handleSubmit}>
                  {editingPetId ? "Update Pet" : "Create Pet"}
                </button>
              </div>
            </div>
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
              <p className="mb-4 sm:mb-6">Are you sure you want to delete this pet?</p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button onClick={() => setDeletePetId(null)} className="px-3 py-1 sm:px-4 sm:py-2 border rounded-lg">Cancel</button>
                <button onClick={confirmDelete} className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
