import { useState, useEffect } from "react";
import axios from "axios";
import { BoardsContainer } from "./Boards.styles";
import Board, { IBoard } from "../Board/Board";

const token = localStorage.getItem("trello-clone-token");

const Boards = () => {
  // TODO: get all boards for this user
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      console.log(token);
      try {
        const response = await axios.get(`http://localhost:5000/api/boards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoards(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <BoardsContainer>
        {boards.map((board: IBoard) => (
          <Board key={board._id} {...board} />
        ))}
      </BoardsContainer>
    </div>
  );
};

export default Boards;
