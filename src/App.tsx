import { useState } from "react";
import "./App.css";

function App() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  );
}

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <button>Home</button>
        </li>
        <li>
          <button>Content</button>
        </li>
      </ul>
    </nav>
  );
}

function Hero() {
  return <section></section>;
}

export default App;
