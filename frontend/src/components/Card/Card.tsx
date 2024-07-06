import { CardContainer, CardTitle } from "./Card.styles";

export interface ICard {
  _id?: string;
  title: string;
}

const Card = ({ title }: ICard) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
    </CardContainer>
  );
};

export default Card;
