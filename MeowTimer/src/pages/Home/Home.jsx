// import Timer from './Timer/Timer'
import '../../App.css'
import './Home.css'
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import { useHistory } from "react-router-dom";



function Home(){
    const history = useHistory();


    return (
        // <div style={{
        //     display:'flex', 
        //     justifyContent: "space-between",
        //     // alignItems: "center",
        //     width: "100%",
        //     padding: '20px 80px 0px 50px',
        // }}
        // >
        <>
        <div className="left-container">
            <div className="home-buttons">
                <img style={{width: '120px', alignSelf: 'center'}} src={catImage} />
                <button onClick={() => history.push("/test-timer")}>
                    <span>Timer</span> 
                    <img src={catClock} />
                </button>
                <button onClick={() => history.push("/brag-board")}>
                    <span>Board</span>
                    <img src={catBrag} />
                </button>
                <button>
                    <span>#3</span>
                    <img src={catImage} />
                </button>
                <button>
                    <span>#4</span>
                    <img src={catImage} />
                </button>
            </div>
        </div>
        <div className='right-container'>
            <h2> Welcome </h2>
            <img style={{width: '40%', alignSelf: 'center'}} src={catBrag} />
        </div>

        </> 

    );
}

export default Home