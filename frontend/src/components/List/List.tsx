import { ListContainer } from "./List.styles";

export interface IList {
  _id?: string;
  title: string;
  boardId?: string;
}

const List = ({ title }: IList) => {
  return (
    <ListContainer>
      {title}
    </ListContainer>
  );
};

export default List;