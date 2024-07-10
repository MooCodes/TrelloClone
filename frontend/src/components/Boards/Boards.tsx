import { useEffect, useState } from "react";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";
import BoardForm from "../BoardForm/BoardForm";
import { useQuery } from "@tanstack/react-query";
import { fetchBoards } from "../../services/boards";

const Boards = () => {
  // store the boards as client state for re-rendering when the board is moved and looks good (no lags)
  const [boards, setBoards] = useState([] as IBoard[]);

  const query = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  useEffect(() => {
    if (query.data) {
      setBoards(query.data);
    }
  }, [query.data]);

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <BoardsContainer>
        {boards.map((board: IBoard) => (
          <Board key={board._id} {...board} />
        ))}
        <BoardForm></BoardForm>
      </BoardsContainer>
    </div>
  );
};

export default Boards;
