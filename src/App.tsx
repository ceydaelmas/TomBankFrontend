import "./App.css";
import TemporaryDrawer from "./components/Drawer";
import MenuAppBar from "./components/Navbar";
import { usePage } from "./contexts/PageContext";
import { RouteList } from "./routes";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
    <div>
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    </div>
  );
}

export default App;
