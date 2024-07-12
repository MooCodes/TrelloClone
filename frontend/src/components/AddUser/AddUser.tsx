import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const FormContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const FormInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`;

const FormButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface IAddUserProps {
  boardId: string;
}

const AddUserForm = ({ boardId }: IAddUserProps) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to handle form submission here
    console.log("User email:", email);

    await addUser.mutate();

    setEmail(""); // Clear the input after submission
  };

  const addUser = useMutation({
    mutationFn: () => {
      const token = localStorage.getItem("trello-clone-token");
      return axios.post(
        `http://localhost:5000/api/boards/${boardId}/users`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormInput
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter user email"
      />
      <FormButton type="submit">Add User To Board</FormButton>
    </FormContainer>
  );
};

export default AddUserForm;
