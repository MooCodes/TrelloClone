import { useEffect, useRef, useState } from "react";
import {
  CardContainer,
  CardTitle,
  CardTitleInput,
  FaPencil,
  FaTrash,
  IconContainer,
} from "./Card.styles";
import { Draggable } from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import CardsService from "../../services/cards";
import { socket } from "../../socket";
import { useAppDispatch } from "../../hooks/redux";
import { deleteCard, updateCardTitle } from "../../redux/slices/listsSlice";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export interface ICard {
  _id: string;
  title: string;
  index: number;
  list: string;
}

const Card = ({ title, _id, index, list }: ICard) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isHovering, setIsHovering] = useState(false);

  const { boardId } = useParams();

  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, newTitle);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const updateMutation = useMutation({
    mutationFn: CardsService.updateCard,
    onSuccess: (data) => {
      console.log(" data", data);

      // update the lists
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: CardsService.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });
      socket.emit("refreshLists", boardId);
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    setNewTitle(val);
  };

  const handleDelete = () => {
    setEditMode(false);

    if (confirm("Delete this card?")) {
      dispatch(deleteCard(_id));
      deleteMutation.mutate(_id);
    }
  };

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
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

                  updateMutation.mutate({ cardId: _id, title: newTitle });
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
            <CardTitle>
              {title}
              {isHovering && (
                <IconContainer>
                  <FaTrash onClick={handleDelete} icon={faTrash} />
                  <FaPencil onClick={() => setEditMode(true)} icon={faPencil} />
                </IconContainer>
              )}
            </CardTitle>
          )}
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card;
