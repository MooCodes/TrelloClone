import { useState } from "react";
import {
  CardButton,
  CardFormContainer,
  CardTitleInput,
  CardTitleContainer,
} from "./CardForm.styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../../socket";

interface ICardFormProps {
  listId: string;
  boardId: string;
}

const CardForm = ({ listId, boardId }: ICardFormProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("trello-clone-token");
  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(
        `http://localhost:5000/api/cards/${listId}`,
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

      socket.emit("refreshLists", boardId);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <CardFormContainer onSubmit={onSubmit}>
      <CardTitleContainer>
        <CardTitleInput
          placeholder="Enter a title for this card..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </CardTitleContainer>
      <CardButton>Add Card</CardButton>
    </CardFormContainer>
  );
};

export default CardForm;
