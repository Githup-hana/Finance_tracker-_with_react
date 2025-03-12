import "./App.css";
import Transactions from "./components/pages/transactions";
import Crypto from "./components/pages/crypto";
import Home from "./components/pages/home";
import Investment from "./components/pages/investment";


function App() {
  return (
    <div className="flex flex-row items-center gap-4 min-h-screen bg-gray-100">  
      <Home />
      <Transactions />
      <Crypto />
    <Investment/>
    </div>
  );
}

export default App;
