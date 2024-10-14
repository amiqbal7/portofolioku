import { Header } from "./compponents/Header";
import StarsCanvas from "./compponents/StarsCanvas";


const App = () => {
  return (
    <div className="App">
      <StarsCanvas />
      <div className="content text-white font-geist-mono">
        <Header />
        {/* Konten lainnya */}
      </div>
    </div>
  );
};

export default App;
