import axios from "axios";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";
import BoardForm from "../BoardForm/BoardForm";
import { useQuery } from "@tanstack/react-query";

const Boards = () => {
  const token = localStorage.getItem("trello-clone-token");
  const query = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  if (query.isLoading) {
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  const { data: boards } = query;

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
