import "./App.css";
import Transactions from "./components/transactions";
import Crypto from "./components/crypto";
import Home from "./components/home";

function App() {
  return (
    <div className="flex row">
      
      <Home />
      <Transactions />
      <Crypto />
    </div>
  );
}

export default App;
