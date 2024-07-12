import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ListFormContainer,
  ListTitleInput,
  ListFormButton,
} from "./ListForm.styles";
import { IList } from "../List/List";
import axios from "axios";
import { socket } from "../../socket";

interface IListFormProps {
  boardId: string;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
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
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshList", boardId);
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
