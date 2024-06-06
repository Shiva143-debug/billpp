import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post("https://plum-cuboid-crest.glitch.me/createUser", formData)
        .then(res => {
            console.log(res);
            navigate("/home")

        }
        )
        .catch(err => console.log(err))
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          onChange={e => setFormData({ ...formData, username: e.target.value })} 
        />
      </label>
      <br />
      <label>
        Password:
        <input
          onChange={e => setFormData({ ...formData, password: e.target.value })} 
        />
      </label>
      <br />
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUserForm;
