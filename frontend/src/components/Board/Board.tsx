import { BoardContainer, BoardHeader, BoardTitle } from "./Board.styles";
import { useNavigate } from "react-router-dom";

export interface IBoard {
  _id: string;
  name: string;
}

const Board = ({ _id, name }: IBoard) => {
  const navigate = useNavigate();

  return (
    <BoardContainer onClick={() => navigate(`/boards/${_id}`)}>
      <BoardHeader>
        <BoardTitle>{name}</BoardTitle>
      </BoardHeader>
      <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
      </div>
    </BoardContainer>
  );
};

export default Board;
