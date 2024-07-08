import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import List, { IList } from "../List/List";
import { IBoard } from "../Board/Board";
import {
  BoardName,
  ListsContainer,
  ListsHeader,
  ListsInviteButton,
} from "./Lists.styles";
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
    return null;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  const { board, lists } = query.data as { board: IBoard; lists: IList[] };

  console.log("board", board);
  console.log("lists", lists);

  return (
    <div unselectable="on" className="unselectable" style={{ backgroundColor: "#7B3123" }}>
      <ListsHeader>
        <BoardName>{board.name}</BoardName>
        <ListsInviteButton>Invite</ListsInviteButton>
      </ListsHeader>
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
    </div>
  );
};

export default Lists;
