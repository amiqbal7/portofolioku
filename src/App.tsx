import { useState, useCallback } from "react";
import Card from "./compponents/Card";
import CursorTail from "./compponents/CursorTail";
import Intro from "./compponents/Intro";
import { Header } from "./compponents/Header";
import StarsCanvas from "./compponents/StarsCanvas";
import { useLenis } from "./hooks/useLenis";

const App = () => {
  const [introDone, setIntroDone] = useState(false);
  const handleDone = useCallback(() => setIntroDone(true), []);

  useLenis();

  return (
    <div className="App">
      {!introDone && <Intro onDone={handleDone} />}

      <div style={{ opacity: introDone ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <CursorTail />
        <StarsCanvas />
        <div className="content">
          <section className="flex items-center justify-center h-screen">
          <Card isReady={introDone} />
          </section>
          <div className="text-white font-geist-mono">
            <Header />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;