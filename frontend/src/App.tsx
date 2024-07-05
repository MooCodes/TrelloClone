import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import LoginForm from "./components/LoginForm";
import Boards from "./components/Boards";

const GlobalStyles = createGlobalStyle`
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
          <Route path="/boards/:userId" element={<Boards />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
