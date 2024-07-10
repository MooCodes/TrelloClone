import axios from "axios";
import { IBoard } from "../components/Board/Board";

export const fetchBoards = async () => {
  const response = await axios.get("http://localhost:5000/api/boards", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
    },
  });
  return response.data;
};

export const moveBoard = ({
  sourceBoard,
  destinationBoard,
}: {
  sourceBoard: IBoard;
  destinationBoard: IBoard;
}) => {
  return axios.put(
    `http://localhost:5000/api/boards/${sourceBoard._id}/${destinationBoard._id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
};

export default { fetchBoards, moveBoard };
