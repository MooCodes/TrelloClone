import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("trello-clone-token");

const Board = () => {
  // TODO: get all boards for this user
  const { userId } = useParams();
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
    }
  
    fetchBoards();
  }, []);

  return <div>Boards for {userId}</div>;
};

export default Board;
