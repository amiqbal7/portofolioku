import Card from "./compponents/Card";
import CursorTail from "./compponents/CursorTail";
import { Header } from "./compponents/Header";
import StarsCanvas from "./compponents/StarsCanvas";


const App = () => {
  return (
    <div className="App">
      <CursorTail />
      <StarsCanvas />
      <div className="content">
        <section className="flex items-center justify-center h-screen">
          <Card />
        </section>
        <div className="text-white font-geist-mono">
        <Header />

        </div>
      </div>
    </div>
  );
};

export default App;