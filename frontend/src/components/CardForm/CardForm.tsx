import { useState } from "react";
import {
  CardButton,
  CardFormContainer,
  CardTitleInput,
  CardTitleContainer,
  ShowCardForm,
  StyledFontAwesomeIcon,
  CardButtonFormContainer
} from "./CardForm.styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addCardToList, updateNewCardId } from "../../redux/slices/listsSlice";
import { ICard } from "../Card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

interface ICardFormProps {
  listId: string;
  boardId: string;
}

const CardForm = ({ listId, boardId }: ICardFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("trello-clone-token");

  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.lists);

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
      console.log(" data", data);
      setTitle("");

      dispatch(updateNewCardId(data));

      socket.emit("refreshLists", boardId);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // get the corresponding list
    const list = lists.find((list) => list._id === listId);

    if (!list) {
      return;
    }

    const newCard: ICard = {
      _id: "0", // need this so droppable wont throw an error
      title,
      list: listId,
      index: list.cards.length,
    };

    dispatch(addCardToList({ listId, card: newCard }));

    setIsFormVisible(false);

    mutation.mutate();
  };

  if (!isFormVisible) {
    return (
      <ShowCardForm onClick={() => setIsFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Add a card</span>
      </ShowCardForm>
    );
  }

  return (
    <CardFormContainer onSubmit={onSubmit}>
      <CardTitleContainer>
        <CardTitleInput
          placeholder="Enter a title for this card..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </CardTitleContainer>
      <CardButtonFormContainer>
        <CardButton>Add Card</CardButton>
        <StyledFontAwesomeIcon
          icon={faX}
          onClick={() => setIsFormVisible(false)}
        />
      </CardButtonFormContainer>
    </CardFormContainer>
  );
};

export default CardForm;
