import axios from "axios";

const createCard = async ({
  title,
  listId,
}: {
  title: string;
  listId: string;
}) => {
  const response = await axios.post(
    `http://localhost:5000/api/cards/${listId}`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

export default { createCard };
