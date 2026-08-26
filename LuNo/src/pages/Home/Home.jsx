// import Timer from './Timer/Timer'
import '../../App.css'
import './Home.css'
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import catWorkout from '../../img/workout.png';
import { useHistory } from "react-router-dom";
import LeftNav from "../../components/LeftNav";



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
        <LeftNav
            icon={catImage}
            buttons={[
                { label: "Timer", icon: catClock, onClick: () => history.push("/test-timer") },
                { label: "Board", icon: catBrag, onClick: () => history.push("/brag-board") },
                { label: "Calories Tracker", icon: catWorkout, onClick: () => history.push("/cal-tracker") },
                { label: "Watch List", icon: catImage, onClick: () => history.push("/watch-list") },
            ]}
        />
        <div className='right-container'>
            <h2> Welcome </h2>
            <img style={{width: '40%', alignSelf: 'center'}} src={catBrag} />
        </div>

        </> 

    );
}

export default Home