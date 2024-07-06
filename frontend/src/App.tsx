import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import LoginForm from "./components/LoginForm/LoginForm";
import Boards from "./components/Boards/Boards";
import Lists from "./components/Lists/Lists";
import "@fontsource/roboto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Roboto';
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #0079bf;
  }
`;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:boardId" element={<Lists />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
