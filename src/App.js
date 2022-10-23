import { QueryClient, QueryClientProvider } from "react-query";
import {
   BrowserRouter as Router,
   Routes,
   Route,
} from "react-router-dom";
import Homes from "./Homes";
import Details from "./routers/Details";
import Highlight from "./routers/Highlight";

const queryClient = new QueryClient()

function App() {

   return (
      <QueryClientProvider client={queryClient}>
         <Router>
            <Routes>
               <Route path="/detail/:videoId" style={{ width: 1000, height: 800 }} element={<Details />}></Route>
               <Route path="/" element={<Homes />}></Route>
               <Route path="/Highlight/:videoId" style={{ width: 1000, height: 800 }} element={<Highlight />}></Route>
            </Routes>
         </Router>
      </QueryClientProvider>
   )
}

export default App