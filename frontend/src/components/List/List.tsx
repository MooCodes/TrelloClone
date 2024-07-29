import {
  CardsContainer,
  ListContainer,
  ListTitle,
  ListHeader,
  StyledEllipsis,
} from "./List.styles";
import Card, { ICard } from "../Card/Card";
import CardForm from "../CardForm/CardForm";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import ListActions from "../ListActions/ListActions";

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

  const handleEllipsis = () => {
    console.log("ellipsis clicked");

    setShowDropdown(!showDropdown);
  };

  return (
    <Draggable key={_id} draggableId={_id!} index={index}>
      {(provided) => (
        <div ref={elementRef} style={{ height: "100%" }}>
          <ListContainer {...provided.draggableProps} ref={provided.innerRef}>
            <ListHeader {...provided.dragHandleProps}>
              <ListTitle>{title}</ListTitle>
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
