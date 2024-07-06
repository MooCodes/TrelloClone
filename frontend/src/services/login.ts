import axios from "axios";

const setToken = (newToken: string) => {
  localStorage.setItem("trello-clone-token", newToken);
};

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post("http://localhost:5000/api/users/login", {
    email,
    password,
  });

  return response.data;
};

export default { login, setToken };
