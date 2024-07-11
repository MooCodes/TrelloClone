import axios from "axios";

export const fetchBoards = async () => {
  const response = await axios.get("http://localhost:5000/api/boards", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
    },
  });
  return response.data;
};

export default { fetchBoards };
