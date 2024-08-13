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

const updateCard = async ({
  cardId,
  title,
}: {
  cardId: string;
  title: string;
}) => {
  const response = await axios.put(
    `http://localhost:5000/api/cards/${cardId}`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const deleteCard = async (cardId: string) => {
  const response = await axios.delete(
    `http://localhost:5000/api/cards/${cardId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

export default { createCard, updateCard, deleteCard };
