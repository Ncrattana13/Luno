import { useState, useEffect } from "react";
import catImage from '../../img/cat-nobg.png';
import '../Home/Home.css';
import dayjs from 'dayjs';

function Timer(){
    const [start, setStart] = useState(false);
    const [second, setSecond] = useState(1);
    const [alert, setAlert] = useState(0)

    const countDown = () => {
        setSecond(second);
        setStart(true);
    }

    const restart = () => {
        setAlert(0)
        setSecond(1);
        setStart(false);
    }

    useEffect(() => {
        if (!start || second === 0) {
            setStart(false)
            return;
        }

        if(second % 3 === 0){
            setAlert((previousAlert) => previousAlert + 1);
        }
        
        const timer = setTimeout(() => {
            setSecond(second - 1);
        }, 1000);


        return () => clearTimeout(timer);

    }, [start, second]);

    return (
        <div className="body-container"> 
            <div>
                <p>{dayjs().format('ddd, MMM DD YYYY hh:mm')}</p>
            </div>

            {!start && second !== 0 && (
                <div style={{display:"flex",
                        flexDirection: "column",
                        gap: "12px", 
                        alignItems: "center",
                        }}
                >
                    <input 
                    type="number"
                    onChange={(event) => setSecond(Number(event.target.value))} 
                    placeholder="Add time"
                    min="1" 
                    />
                
                    <button onClick={countDown} style={{width: "fit-content"}}> Start </button>
                
                </div>
            )}

            {start && <p> {second} </p>}
            {!start && second === 0 && (
                <div> 
                    <img className="cat-image" src={catImage} alt="Orange cartoon cat" />
                    <p> Time is up!</p>
                    <p> Alert 30minute: {alert} times!</p>
                    <button onClick={restart}> Restart </button>
                </div>)}
        </div>
    );
}

export default Timer