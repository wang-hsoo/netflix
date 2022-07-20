import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Header from "./Routes/Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        {/* 두개의 path에서 같은 컴포넌트를 render 하도록 함*/}
        <Route path={["/", "/movies/:movieID"]}> 
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
