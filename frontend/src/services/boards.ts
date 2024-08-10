import axios from "axios";

const getBoards = async () => {
  const response = await axios.get("http://localhost:5000/api/boards", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
    },
  });
  return response.data;
};

const getBoard = async (boardId: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/boards/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const createBoard = async (name: string) => {
  const response = await axios.post(
    "http://localhost:5000/api/boards",
    { name },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const deleteBoard = async (boardId: string) => {
  const response = await axios.delete(
    `http://localhost:5000/api/boards/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

export default { getBoards, getBoard, createBoard, deleteBoard };
