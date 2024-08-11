import {
  CardsContainer,
  ListContainer,
  ListTitle,
  ListHeader,
  StyledEllipsis,
  ListTitleInput,
} from "./List.styles";
import Card, { ICard } from "../Card/Card";
import CardForm from "../CardForm/CardForm";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import ListActions from "../ListActions/ListActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateListTitle } from "../../redux/slices/listsSlice";
import { socket } from "../../socket";
import ListsService from "../../services/lists";

export interface IList {
  _id: string;
  title: string;
  cards: ICard[];
  index: number;
  boardId: string;
}

const List = ({ _id, title, index, cards, boardId }: IList) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  console.log("title", title);
  console.log("newTitle", newTitle);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const lists = useAppSelector((state) => state.lists.lists);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: ListsService.updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);
    },
  });

  const handleEllipsis = () => {
    console.log("ellipsis clicked");

    setShowDropdown(!showDropdown);
  };

  const handleEditClick = () => {
    console.log("edit title clicked");
    setEditMode(!editMode);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // update list title in local state

      // find the list in the state
      const list = lists.find((list) => list._id === _id);
      if (!list) {
        return;
      }

      // create a new list
      const newList = {
        ...list,
        title: newTitle,
      };

      // update the state
      dispatch(updateListTitle(newList));

      setEditMode(false);

      // update list title on the server via mutation
      editMutation.mutate({ listId: _id, title: newTitle });
    }
  };

  return (
    <Draggable key={_id} draggableId={_id!} index={index}>
      {(provided) => (
        <div ref={elementRef} style={{ height: "100%" }}>
          <ListContainer {...provided.draggableProps} ref={provided.innerRef}>
            <ListHeader {...provided.dragHandleProps}>
              {editMode ? (
                <ListTitleInput
                  autoFocus
                  onBlur={handleEditClick}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleOnKeyDown}
                />
              ) : (
                <ListTitle onClick={handleEditClick}>{title}</ListTitle>
              )}
              <StyledEllipsis
                icon={faEllipsisH}
                onClick={handleEllipsis}
                id={_id}
              />
            </ListHeader>
            {showDropdown && (
              <ListActions
                setShowDropdown={setShowDropdown}
                listRef={elementRef}
                listId={_id}
                boardId={boardId}
              />
            )}
            <Droppable type="cards" droppableId={_id!} direction="vertical">
              {(provided) => (
                <CardsContainer
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {cards.map((card: ICard) => (
                    <Card
                      key={card._id}
                      _id={card._id}
                      title={card.title}
                      index={card.index}
                      list={card.list}
                    />
                  ))}
                  {provided.placeholder}
                  <CardForm listId={_id as string} boardId={boardId} />
                </CardsContainer>
              )}
            </Droppable>
          </ListContainer>
        </div>
      )}
    </Draggable>
  );
};

export default List;
