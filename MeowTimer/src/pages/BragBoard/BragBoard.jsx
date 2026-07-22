import '../../App.css'
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import { useHistory } from "react-router-dom";
import CatCard from './CatCard/CatCard'
import LuNo from '../../img/LuNo.jpg'
import { useState, useEffect} from 'react';
import catWorkout from "../../img/workout.png"


function BragBoard(){
    const history = useHistory();
    const cats = [
    {
    id: 1,
    name: "Uno",
    age: 3,
    description: "Cute and playful",
    location: "Portland",
    },

    {
    id: 2,
    name: "Luna",
    age: 4,
    description: "Quiet and sweet",
    pic: LuNo,
    location: "Beaverton",
    },

    {
    id: 3,
    name: "Milo",
    age: 2,
    description: "Loves to sleep",
    location: "Hillsboro",
    },

    {
    id: 4,
    name: "Nala",
    age: 5,
    description: "Friendly and curious",
    location: "Salem",
    },

    {
    id: 5,
    name: "Leo",
    age: 1,
    description: "Very energetic",
    location: "Gresham",
    },

    {
    id: 6,
    name: "Coco",
    age: 6,
    description: "Calm and cuddly",
    location: "Tigard",
    },

    {
    id: 7,
    name: "Mochi",
    age: 3,
    description: "Loves treats",
    location: "Lake Oswego",
    },

    {
    id: 8,
    name: "Simba",
    age: 7,
    description: "Gentle and relaxed",
    location: "Vancouver",
    },

    {
    id: 9,
    name: "Oreo",
    age: 2,
    description: "Black and white troublemaker",
    location: "Portland",
    },

    {
    id: 10,
    name: "Pepper",
    age: 4,
    description: "Shy but loving",
    location: "Wilsonville",
    },
];  

    const [sortLocation, setSortLocation] = useState('');

    const handleLocation = (location) => {
        setSortLocation(location);
    }

    const filteredCats = sortLocation ? cats.filter(
        (cat) => cat.location.trim().toLocaleLowerCase() 
        === sortLocation.trim().toLocaleLowerCase()) : cats;
      
    return (
        <>
            <div className='left-container'>
                <div className="home-buttons">
                    <img style={{width: '120px', alignSelf: 'center'}} src={catBrag} />
                        <button onClick={() => history.push("/test-timer")}>
                            <span>Timer</span> 
                            <img src={catClock} />
                        </button>

                        <div className='select-button'>
                            <button>
                                <span>Board</span>
                                <img src={catBrag} />
                            </button>
                        </div>

                        <button onClick={() => history.push("/cal-tracker")}>
                            <span>Calories Tracker</span>
                            <img src={catWorkout} />
                        </button>
                        <button onClick={() => history.push("/")}>
                            <span>#4</span>
                            <img src={catImage} />
                        </button>
                </div>
                    
            </div>
            <div className='right-container'>
                <div className='right-container-header'> 
                    <h2 style={{padding: '5px', color:'var(--dark-blue)'}}> 
                        Cat Board 
                    </h2>
                    <button style={{width:'fit-content'}}>Favorites</button>

                {sortLocation && ( 
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '50px'}}>
                        <p>Showing location: {sortLocation} ({filteredCats.length}) </p>
                        <button style={{height:'fit-content'}} onClick={() => setSortLocation('')} > Show All </button> 
                    </div>
                )}                 

            </div>
                <div className='right-container-bottom' id='brag'>
                  
                    {filteredCats.map((cat) => 
                    <CatCard 
                        key={cat.id} 
                        cat={cat} 
                        handleLocation={handleLocation}     
                    /> )}
                    {!sortLocation && <span className='add-card-box' title='Click to Add'> + </span>}
                </div>
            </div>
        </>
    );
}

export default BragBoard