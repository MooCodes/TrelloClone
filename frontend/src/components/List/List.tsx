import { CardsContainer, ListContainer, ListTitle } from "./List.styles";
import Card, { ICard } from "../Card/Card";
import CardForm from "../CardForm/CardForm";
import { Draggable, Droppable } from "@hello-pangea/dnd";

export interface IList {
  _id: string;
  title: string;
  cards: ICard[];
  index: number;
  boardId: string;
}

const List = ({ _id, title, index, cards, boardId }: IList) => {
  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <>
          <ListContainer {...provided.draggableProps} ref={provided.innerRef}>
            <ListTitle {...provided.dragHandleProps}>{title}</ListTitle>
            <Droppable type="cards" droppableId={_id} direction="vertical">
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
                    />
                  ))}
                  {provided.placeholder}
                  <CardForm listId={_id as string} boardId={boardId} />
                </CardsContainer>
              )}
            </Droppable>
          </ListContainer>
        </>
      )}
    </Draggable>
  );
};

export default List;
