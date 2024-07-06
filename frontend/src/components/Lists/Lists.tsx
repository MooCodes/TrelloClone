import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import List, { IList } from "../List/List";
import { IBoard } from "../Board/Board";
import { ListsContainer, BoardName } from "./Lists.styles";
import ListForm from "../ListForm/ListForm";

const Lists = () => {
  const { boardId } = useParams();
  const token = localStorage.getItem("trello-clone-token");

  const query = useQuery({
    queryKey: ["listsAndBoard", boardId],
    queryFn: async () => {
      const [boardResponse, listsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`http://localhost:5000/api/lists/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      return {
        board: boardResponse.data as IBoard,
        lists: listsResponse.data as IList[],
      };
    },
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  const { board, lists } = query.data as { board: IBoard; lists: IList[] };

  console.log("board", board);
  console.log("lists", lists);

  return (
    <>
      <BoardName>{board.name}</BoardName>
      <ListsContainer>
        {lists.map((list: IList) => (
          <List
            key={list._id}
            _id={list._id}
            title={list.title}
            cards={list.cards}
          />
        ))}
        <ListForm boardId={board._id} />
      </ListsContainer>
    </>
  );
};

export default Lists;
