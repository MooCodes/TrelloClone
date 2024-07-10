import { CardsContainer, ListContainer, ListTitle } from "./List.styles";
import Card, { ICard } from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
  const token = localStorage.getItem("trello-clone-token");

  const query = useQuery({
    queryKey: ["cards", _id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/api/cards/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <ListContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListTitle>{title}</ListTitle>
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
      )}
    </Draggable>
  );
};

export default List;
