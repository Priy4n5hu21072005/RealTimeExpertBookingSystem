import { useState } from "react";

import API from "../services/api";
import { useToast } from "../context/ToastContext";

function CreateExpertProfile() {
  const { showToast } = useToast();

  const [expertise, setExpertise] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [hourlyRate, setHourlyRate] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        showToast("Please login first", "warning");
        return;
      }

      const response =
        await API.post(
          "/experts",
          {
            expertise,
            bio,
            experience,
            skills:
              skills.split(",").map(skill => skill.trim()).filter(Boolean),
            hourlyRate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      showToast(
        "Expert profile created",
        "success"
      );

      // Reset form fields
      setExpertise("");
      setBio("");
      setExperience("");
      setSkills("");
      setHourlyRate("");

    } catch (error) {

      showToast(
        error.response?.data?.message || 
        "Error creating profile",
        "error"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center items-center">

      <div className="bg-white rounded-2xl p-8 shadow-md max-w-2xl w-full">

        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Create Expert Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expertise Area
            </label>
            <input
              type="text"
              placeholder="e.g. Web Development, UI/UX Design"
              value={expertise}
              onChange={(e) =>
                setExpertise(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={experience}
                onChange={(e) =>
                  setExperience(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate (INR)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={hourlyRate}
                onChange={(e) =>
                  setHourlyRate(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, CSS, MongoDB"
              value={skills}
              onChange={(e) =>
                setSkills(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brief Bio
            </label>
            <textarea
              placeholder="Tell clients about your skills, background, and expert service..."
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition min-h-[120px] resize-y"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold text-lg"
          >
            Create Profile
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateExpertProfile;