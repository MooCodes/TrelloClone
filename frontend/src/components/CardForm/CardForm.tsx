import { useRef, useState } from "react";
import {
  CardButton,
  CardFormContainer,
  CardTitleInput,
  CardTitleContainer,
  ShowCardForm,
  StyledFontAwesomeIcon,
  CardButtonFormContainer,
} from "./CardForm.styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addCardToList, updateNewCardId } from "../../redux/slices/listsSlice";
import { ICard } from "../Card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import useClickOutside from "../../hooks/useClickOutside";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import CardsService from "../../services/cards";

interface ICardFormProps {
  listId: string;
  boardId: string;
}

const CardForm = ({ listId, boardId }: ICardFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");

  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.lists);

  const wrapperRef = useClickOutside(() => {
    setIsFormVisible(false);
    setTitle("");
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useAutosizeTextArea(textAreaRef, title);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;

    setTitle(val);
  };

  const mutation = useMutation({
    mutationFn: CardsService.createCard,
    onSuccess: (data) => {
      console.log(" data", data);
      setTitle("");

      dispatch(updateNewCardId(data));

      // update the lists
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

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

    if (!title) {
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

    mutation.mutate({ title, listId });
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
    <div ref={wrapperRef}>
      <CardFormContainer ref={formRef} onSubmit={onSubmit}>
        <CardTitleContainer>
          <CardTitleInput
            ref={textAreaRef}
            autoFocus
            placeholder="Enter a title for this card..."
            value={title}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
        </CardTitleContainer>
        <CardButtonFormContainer>
          <CardButton>Add Card</CardButton>
          <StyledFontAwesomeIcon
            icon={faX}
            onClick={() => {
              setTitle("");
              setIsFormVisible(false);
            }}
          />
        </CardButtonFormContainer>
      </CardFormContainer>
    </div>
  );
};

export default CardForm;
