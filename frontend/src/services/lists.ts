import axios from "axios";

const getLists = async (boardId: string) => {
  const response = await axios.get(
    `http://localhost:5000/api/lists/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const createList = async ({
  title,
  boardId,
}: {
  title: string;
  boardId: string;
}) => {
  const response = await axios.post(
    `http://localhost:5000/api/lists/${boardId}`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const deleteList = async (listId: string) => {
  const response = await axios.delete(
    `http://localhost:5000/api/lists/${listId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const updateList = async ({
  listId,
  title,
}: {
  listId: string;
  title: string;
}) => {
  const response = await axios.put(
    `http://localhost:5000/api/lists/${listId}`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const moveList = async ({
  listId,
  index,
}: {
  listId: string;
  index: number;
}) => {
  const response = await axios.patch(
    `http://localhost:5000/api/lists/${listId}`,
    { index },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const moveCard = async ({
  cardId,
  index,
}: {
  cardId: string;
  index: number;
}) => {
  const response = await axios.patch(
    `http://localhost:5000/api/cards/${cardId}`,
    { index },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

const moveCardToList = async ({
  cardId,
  listId,
  index,
}: {
  cardId: string;
  listId: string;
  index: number;
}) => {
  const response = await axios.put(
    `http://localhost:5000/api/cards/${cardId}/${listId}`,
    { index },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
      },
    }
  );
  return response.data;
};

export default {
  getLists,
  createList,
  deleteList,
  updateList,
  moveList,
  moveCard,
  moveCardToList,
};
