import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListFormContainer,
  ListTitleInput,
  ListFormButton,
} from "./ListForm.styles";
import { IList } from "../List/List";
import { IBoard } from "../Board/Board";
import axios from "axios";

interface IListFormProps {
  boardId: string;
}

interface IListsAndBoard {
  board: IBoard;
  lists: IList[];
}

const ListForm = ({ boardId }: IListFormProps) => {
  const token = localStorage.getItem("trello-clone-token");
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(
        `http://localhost:5000/api/lists/${boardId}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: ({ data }) => {
      const listsAndBoard = queryClient.getQueryData([
        "listsAndBoard",
        boardId,
      ]) as IListsAndBoard;
      console.log("data", data);
      console.log("listsAndBoard", listsAndBoard);

      // append new list to the end of the list
      const newListsAndBoard = {
        ...listsAndBoard,
        lists: [...listsAndBoard.lists, data],
      };

      queryClient.setQueryData(["listsAndBoard", boardId], newListsAndBoard);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate();
  };

  return (
    <ListFormContainer onSubmit={handleSubmit}>
      <ListTitleInput
        placeholder="Enter list title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ListFormButton>Add List</ListFormButton>
    </ListFormContainer>
  );
};

export default ListForm;
