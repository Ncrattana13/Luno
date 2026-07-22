import Home from './pages/Home/Home'
import './App.css'
import logo from './img/logo.png';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Timer from "./pages/Timer/Timer";
import TestTimer from "./pages/Timer/TestTimer";
import AboutMe from "./pages/AboutMe/AboutMe";
import BragBoard from "./pages/BragBoard/BragBoard";
import CalTracker from "./pages/CalTracker/CalTracker";

function App() {
    
  return ( 

    <Router> 
      <div className="header">
        <img style={{width:"150px", 
            height:"auto", 
            alignSelf: "flex-start", 
            padding: "0px 0px 0px 50px"}}
            src={logo} 
        />
        <div style={{display: "flex", alignSelf: "flex-end", padding: "0px 15px 5px 0px"}}>
          <input placeholder="Search " />
        </div>
      </div>

      <div className="nav-bar">
          <a href="http://localhost:5173/home">Home</a>
          <a href="http://localhost:5173/brag-board">Bragging Board</a>
          <a href="http://localhost:5173/test-timer">Timer</a>
          <a href="http://localhost:5173/cal-tracker">Calories Tracker</a>

          <p>Calendar</p>
          <a href="http://localhost:5173/about-me">About Me</a>
          <p>GitHub</p>
          <a href="https://www.youtube.com/shorts/t6PvC-IUiqw"
            target="_blank"
            rel="noopener noreferrer"
          >Youtube</a> 
      </div>
      
      <div className="container">
        <Switch> 
          <Route path="/home">
            <Home />
          </Route>
          {/* <Route path="/timer">
            <Timer />
          </Route> */}
          <Route path="/test-timer">
            <TestTimer />
          </Route>
          <Route path="/about-me">
            <AboutMe />
          </Route>
          <Route path="/brag-board">
            <BragBoard />
          </Route>
          <Route path="/cal-tracker">
            <CalTracker />
          </Route>
        </Switch>
      </div>
      

    </Router>
  );
}

export default App