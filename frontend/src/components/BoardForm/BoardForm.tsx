import { useState } from "react";
import {
  BoardFormContainer,
  BoardTitleInput,
  BoardAddButton,
  BoardTitleText,
} from "./BoardForm.styles";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { IBoard } from "../Board/Board";

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
    onSuccess: ({ data })=> {
      setName("");
      const boards = queryClient.getQueryData(["boards"]) as IBoard[];
      // append new board to the end of the list
      queryClient.setQueryData(["boards"], [...boards, data]);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate();
  };

  return (
    <>
      <BoardFormContainer onSubmit={handleSubmit}>
        <BoardTitleText>Board title*</BoardTitleText>
        <BoardTitleInput
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BoardAddButton>Create</BoardAddButton>
      </BoardFormContainer>
    </>
  );
};

export default BoardForm;
