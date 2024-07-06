import { ListContainer, ListTitle } from "./List.styles";
import Card, { ICard } from "../Card/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CardForm from "../CardForm/CardForm";

export interface IList {
  _id?: string;
  title: string;
  cards: [];
}

const List = ({ _id, title }: IList) => {
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
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  const { data: cards } = query;

  return (
    <ListContainer>
      <ListTitle>{title}</ListTitle>
      {cards.map((card: ICard) => (
        <Card key={card._id} title={card.title} />
      ))}
      <CardForm listId={_id as string} />
    </ListContainer>
  );
};

export default List;
