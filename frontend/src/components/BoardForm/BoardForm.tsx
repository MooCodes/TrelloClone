import { useState } from "react";
import {
  BoardFormContainer,
  BoardTitleInput,
  BoardAddButton,
} from "./BoardForm.styles";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const BoardForm = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(
        "http://localhost:5000/api/boards",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "trello-clone-token"
            )}`,
          },
        }
      );
    },
    onSuccess: ()=> {
      setName("");
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      })
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate();
  };

  return (
    <>
      <BoardFormContainer onSubmit={handleSubmit}>
        <BoardTitleInput
          placeholder="Enter board title..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BoardAddButton>Create</BoardAddButton>
      </BoardFormContainer>
    </>
  );
};

export default BoardForm;
