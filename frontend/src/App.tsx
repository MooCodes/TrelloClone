import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import LoginForm from "./components/LoginForm/LoginForm";
import Boards from "./components/Boards/Boards";
import "@fontsource/roboto";

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

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/boards" element={<Boards />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
