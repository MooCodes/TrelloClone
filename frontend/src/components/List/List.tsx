import { ListContainer, ListTitle } from "./List.styles";
import Card, { ICard } from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CardForm from "../CardForm/CardForm";
import { Draggable } from "@hello-pangea/dnd";

export interface IList {
  _id: string;
  title: string;
  cards: [];
  index: number;
}

const List = ({ _id, title, index }: IList) => {
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

  const { data: cards } = query;

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <ListContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListTitle>{title}</ListTitle>
          {cards.map((card: ICard) => (
            <Card key={card._id} title={card.title} />
          ))}
          <CardForm listId={_id as string} />
        </ListContainer>
      )}
    </Draggable>
  );
};

export default List;
