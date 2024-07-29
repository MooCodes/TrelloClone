import { useMutation, useQueryClient } from "@tanstack/react-query";
import useClickOutside from "../../hooks/useClickOutside";
import {
  ListActionsHeader,
  ListActionsContainer,
  ListActionTitle,
  ListActionTrash,
  ListActionDelete,
} from "./ListActions.styles";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { socket } from "../../socket";

interface IProps {
  listId: string;
  boardId: string;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  listRef: React.RefObject<HTMLDivElement>;
}

const ListActions = ({ listId, boardId, setShowDropdown, listRef }: IProps) => {
  const listPosition = listRef.current?.getBoundingClientRect();

  const wrapperRef = useClickOutside((event) => {
    if (event.target instanceof SVGElement && event.target.id === listId) {
      // fancy way of checking if the click was on this specific lists' ellipsis
      return;
    } else {
      setShowDropdown(false);
    }
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`http://localhost:5000/api/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("trello-clone-token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listsAndBoard", boardId] });

      socket.emit("refreshLists", boardId);

      setShowDropdown(false);
    },
  });

  const handleDelete = () => {
    // make a delete request here

    deleteMutation.mutate();
  };

  if (listPosition === undefined) {
    return null;
  }

  return (
    <ListActionsContainer
      ref={wrapperRef}
      style={{
        left: listPosition.left + 210,
        top: listPosition.top + 50,
      }}
    >
      <ListActionsHeader>
        <div></div>
        <ListActionTitle>List Actions</ListActionTitle>
        <ListActionTrash
          icon={faX}
          size="sm"
          onClick={() => setShowDropdown(false)}
        />
      </ListActionsHeader>
      <ListActionDelete onClick={handleDelete}>Delete</ListActionDelete>
    </ListActionsContainer>
  );

  // return <ListActionsContainer>Hello</ListActionsContainer>;
};

export default ListActions;
