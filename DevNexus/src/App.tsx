import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Projetos from "./pages/Projetos";
import Vagas from "./pages/Vagas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/projetos" element={<Projetos />} />
      <Route path="/vagas" element={<Vagas />} />
    </Routes>
  );
}

export default App;
