import '../Home/Home.css'
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { useHistory } from "react-router-dom";
import Meow from '../../audio/Luna.m4a';


function TestTimer(){
    const history = useHistory();

    const [start, setStart] = useState(false);
    const [second, setSecond] = useState(1);
    const [alert, setAlert] = useState(0);
    // const [displayTime, setDisplayTime] = useState([0,0,0]);

    const countDown = (duration) => {
        const endTime = Date.now() + (duration * 1000);

        localStorage.setItem("endTime", JSON.stringify(endTime));
        setSecond(duration);
        setStart(true);
    };

    const restart = () => {
        setAlert(0)
        setSecond(1);
        setStart(false);
        localStorage.removeItem("endTime");
    };

    useEffect(() => {

        const savedEndTime = JSON.parse(localStorage.getItem("endTime"));
        
        if(savedEndTime){
            const timeLeft = Math.max(0, Math.ceil((savedEndTime - Date.now()) / 1000));
            if (timeLeft > 0) {
                setSecond(timeLeft);
                setStart(true);
            }
        }

    }, []);

    useEffect(() => {
        const endTime = JSON.parse(localStorage.getItem("endTime"));

        if (!start || !endTime) return;

        if(second % 60 === 0){
            setAlert((previousAlert) => previousAlert + 1);
        }

        const timer = setInterval(() => {
            const timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            setSecond(timeLeft);

            if(timeLeft === 0){
                const audio = new Audio(Meow);
                audio.play();
                
                setSecond(0)
                setStart(false);
                localStorage.removeItem("endTime");
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [start, second]);

    return (
        <>
            <div className="left-container">
                <div className="home-buttons">
                    <img style={{width: '120px', alignSelf: 'center'}} src={catClock} />
                    <div className='select-button'>
                    <button onClick={() => history.push("/test-timer")}>
                        <span>Timer</span> 
                        <img src={catClock} />
                    </button>
                    </div>
                    <button onClick={() => history.push("/brag-board")}>
                        <span>Board</span>
                        <img src={catBrag} />
                    </button>
                    <button onClick={() => history.push("/")}>
                        <span>#3</span>
                        <img src={catImage} />
                    </button>
                    <button onClick={() => history.push("/")}>
                        <span>#4</span>
                        <img src={catImage} />
                    </button>
                </div>
            </div>
            {/* <Timer />67 */}
            <div className='right-container' id='timer'>
                <div right-container-header>
                    <p>{dayjs().format('ddd, MMM DD YYYY hh:mm')}</p>
                </div>
                
                <div right-container-bottom>
                {!start && second !== 0 && (
                    <div style={{display:'flex', justifyContent: 'center', paddingLeft:'20px'}}>
                        <input 
                            type="number"
                            onChange={(event) => setSecond(Number(event.target.value) * 60)} 
                            placeholder="Custom(Minute)"
                            min="1" 
                        />
                        
                                
                        <button onClick={() => countDown(second)} style={{width: "fit-content"}}> Start </button>
                    </div>
                )}
                
                {start && ( <>
                    <p> {Math.floor(second / 60 / 60)} Hour(s) : {Math.floor(second / 60) % 60} Minute(s) : {second % 60} Second(s) </p>
                    <button style={{width: 'fit-content'}} onClick={restart} title="Cencel">Cancel</button> </>
                )}

                {!start && second === 0 && (
                    <div> 
                        <img className="cat-image" src={catImage} alt="Orange cartoon cat" />
                        <p> Time is up!</p>
                        <p> Alert: {alert} minutes!</p>
                        <button onClick={restart}> Restart </button>
                    </div>
                )}

                {!start && <div style={{display:'flex', alignSelf: 'flex-end'}}>
                    <button onClick={() => {countDown(30 * 60)}} title="30 minutes">Play</button>
                    <button onClick={() => {countDown(15 * 60)}}title='15 minutes'>Feed</button>
                    <button onClick={() => {countDown(90 * 60)}}title='1:30 hours'>Pet</button>
                    <button onClick={() => {countDown(120 * 60)}}title='2 hours'>Clean</button>
                    <button onClick={() => {countDown(180 * 60)}}title='3 hours'>Go Work</button>

                </div> }
                </div>
            </div>

            

        </>
    );
}

export default TestTimer