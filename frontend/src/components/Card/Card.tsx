import { CardContainer, CardTitle } from "./Card.styles";
import { Draggable } from "@hello-pangea/dnd";

export interface ICard {
  _id: string;
  title: string;
  index: number;
}

const Card = ({ title, _id, index }: ICard) => {
  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardTitle>{title}</CardTitle>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card;
