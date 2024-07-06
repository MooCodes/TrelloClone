import { useState } from "react";
import {
  CardButton,
  CardFormContainer,
  CardTitleInput,
  CardTitleContainer,
} from "./CardForm.styles";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import { ICard } from "../Card/Card";

const CardForm = ({ listId }: { listId: string }) => {
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
    onSuccess: ({ data }) => {
      setTitle("");

      const cards = queryClient.getQueryData(["cards", listId]) as ICard[];

      queryClient.setQueryData(["cards", listId], [...cards, data]);
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
          placeholder="Enter card title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </CardTitleContainer>
      <CardButton>Add Card</CardButton>
    </CardFormContainer>
  );
};

export default CardForm;
