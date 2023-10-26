import {Routes, Route} from "react-router-dom";
import About from "./component/About";
import Login from "./component/landing";
import Form from "./component/form";
import UserHome from "./component/UserHome";

function App() {
  return (
    <>
    <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/userHome" element={ <UserHome /> } />
      <Route path="/about" element={ <About /> } />
        <Route path="/form" element={<Form />} />
    </Routes>
    </>
  );
}

export default App;
