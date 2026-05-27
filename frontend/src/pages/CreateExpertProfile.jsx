import { useState } from "react";

import API from "../services/api";

function CreateExpertProfile() {

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

      const response =
        await API.post(
          "/experts",
          {
            expertise,
            bio,
            experience,
            skills:
              skills.split(","),
            hourlyRate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(response.data);

      alert(
        "Expert profile created"
      );

    } catch (error) {

      console.log(
        error.response.data
      );

      alert("Error creating profile");
    }
  };

  return (

    <div>

      <h1>
        Create Expert Profile
      </h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Expertise"
          value={expertise}
          onChange={(e) =>
            setExpertise(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Experience"
          value={experience}
          onChange={(e) =>
            setExperience(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Skills separated by commas"
          value={skills}
          onChange={(e) =>
            setSkills(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Hourly Rate"
          value={hourlyRate}
          onChange={(e) =>
            setHourlyRate(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button type="submit">
          Create Profile
        </button>

      </form>

    </div>
  );
}

export default CreateExpertProfile;