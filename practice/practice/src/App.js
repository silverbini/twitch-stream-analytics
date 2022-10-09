import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./routers/Home";
import Detail from "./routers/Detail";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/movie/:id" element={<Detail />}> </Route>


        <Route path="/" element={<Home />}></Route>

      </Routes>



    </Router>
  )
}

export default App