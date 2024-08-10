import { useEffect, useRef, useState } from "react";
import { CardContainer, CardTitle, CardTitleInput } from "./Card.styles";
import { Draggable } from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import CardsService from "../../services/cards";
import { socket } from "../../socket";
import { useAppDispatch } from "../../hooks/redux";
import { updateCardTitle } from "../../redux/slices/listsSlice";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export interface ICard {
  _id: string;
  title: string;
  index: number;
  list: string;
}

const Card = ({ title, _id, index, list }: ICard) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { boardId } = useParams();

  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, newTitle);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    setNewTitle(val);
  };

  const mutation = useMutation({
    mutationFn: CardsService.updateCard,
    onSuccess: (data) => {
      console.log(" data", data);

      // update the lists
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);
    },
  });

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {editMode ? (
            <CardTitleInput
              ref={textAreaRef}
              autoFocus
              onBlur={() => {
                setEditMode(false);
                setNewTitle(title);
              }}
              onChange={handleChange}
              value={newTitle}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  if (newTitle === "") return;

                  setEditMode(false);

                  const updatedCard: ICard = {
                    _id,
                    title: newTitle,
                    list,
                    index,
                  };

                  // update the cards title on the client
                  dispatch(updateCardTitle(updatedCard));

                  mutation.mutate({ cardId: _id, title: newTitle });
                }
              }}
              onFocus={(event) => {
                setEditMode(true);

                event.currentTarget.setSelectionRange(
                  event.currentTarget.value.length,
                  event.currentTarget.value.length
                );
              }}
            />
          ) : (
            <CardTitle onClick={() => setEditMode(true)}>{title}</CardTitle>
          )}
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card;
