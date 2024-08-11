import React, { useState } from "react";
import { FormButton, FormContainer, FormInput } from "./AddUser.styles";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IAddUserProps {
  boardId: string;
}

const AddUserForm = ({ boardId }: IAddUserProps) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("email", email);

    addUser.mutate();
  };

  const addUser = useMutation({
    mutationFn: () => {
      console.log("email", email);
      return axios.post(
        `http://localhost:5000/api/boards/${boardId}/users`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "trello-clone-token"
            )}`,
          },
        }
      );
    },
    onSuccess: () => {
      setEmail("");
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
