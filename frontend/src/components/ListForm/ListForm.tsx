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
import { socket } from "../../socket";

interface IListFormProps {
  boardId: string;
}

interface IListAndBoard {
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
      console.log(data);
      setTitle("");
      // queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      // get the old lists
      const oldLists = queryClient.getQueryData([
        "listsAndBoard",
        boardId,
      ]) as IListAndBoard;

      const newListsAndBoard = {
        ...oldLists,
        lists: [...oldLists.lists, data],
      };

      console.log("setting newListsAndBoard", newListsAndBoard);

      queryClient.setQueryData(["listsAndBoard", boardId], newListsAndBoard);

      console.log("oldLists", newListsAndBoard);

      socket.emit("refreshLists", boardId);
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
