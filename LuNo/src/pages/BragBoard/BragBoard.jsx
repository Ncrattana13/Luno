import '../../App.css'
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import { useHistory } from "react-router-dom";
import CatCard from './CatCard/CatCard'
import LuNo from '../../img/LuNo.jpg'
import { useState, useEffect} from 'react';
import catWorkout from "../../img/workout.png"
import { addCat, handleFav } from './BragBoard.helpers';
import { Camera } from 'lucide-react';
import LeftNav from "../../components/LeftNav";

function BragBoard(){
    const history = useHistory();
    const [cats, setCats] = useState(() => {
        const saved = localStorage.getItem("cats");
        return saved ? JSON.parse(saved) : [
            {
            id: 1,
            name: "Uno",
            age: 3,
            description: "Cute and playful",
            location: "Portland",
            fav: false,
            },

            {
            id: 2,
            name: "Luna",
            age: 4,
            description: "Quiet and sweet",
            pic: LuNo,
            location: "Beaverton",
            fav: false,
            },

            {
            id: 3,
            name: "Milo",
            age: 2,
            description: "Loves to sleep",
            location: "Hillsboro",
            fav: false,
            },

            {
            id: 4,
            name: "Nala",
            age: 5,
            description: "Friendly and curious",
            location: "Salem",
            fav: false,
            },

            {
            id: 5,
            name: "Leo",
            age: 1,
            description: "Very energetic",
            location: "Gresham",
            fav: false,
            },

            {
            id: 6,
            name: "Coco",
            age: 6,
            description: "Calm and cuddly",
            location: "Tigard",
            fav: false,
            },

            {
            id: 7,
            name: "Mochi",
            age: 3,
            description: "Loves treats",
            location: "Lake Oswego",
            fav: false,
            },

            {
            id: 8,
            name: "Simba",
            age: 7,
            description: "Gentle and relaxed",
            location: "Vancouver",
            fav: false,
            },

            {
            id: 9,
            name: "Oreo",
            age: 2,
            description: "Black and white troublemaker",
            location: "Portland",
            fav: false,
            },

            {
            id: 10,
            name: "Pepper",
            age: 4,
            description: "Shy but loving",
            location: "Wilsonville",
            fav: false,
            },
    ]});  

    const onFav = (id) => handleFav(id, cats, setCats);

    const [showFav, setShowFav] = useState(false);

    useEffect(() => {
        localStorage.setItem("cats", JSON. stringify(cats));
    }, [cats]);

    const [sortLocation, setSortLocation] = useState('');

    const handleLocation = (location) => {
        setSortLocation(location);
    }

    const filteredCats = sortLocation ? cats.filter(
        (cat) => cat.location.trim().toLocaleLowerCase() 
        === sortLocation.trim().toLocaleLowerCase()) : cats;

    const visibleCats = showFav ? filteredCats.filter((cat) => cat.fav) : filteredCats;

    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        addCat(name, Number(age), description, location, cats, setCats);
        setName('');
        setAge('');
        setDescription('');
        setLocation('');
        setShowAddModal(false);

    };
      
    return (
        <>
            <LeftNav
                icon={catBrag}
                buttons={[
                    { label: "Timer", icon: catClock, onClick: () => history.push("/test-timer") },
                    { label: "Board", icon: catBrag, selected: true },
                    { label: "Calories Tracker", icon: catWorkout, onClick: () => history.push("/cal-tracker") },
                    { label: "Watch List", icon: catImage, onClick: () => history.push("/watch-list") },
                ]}
            />
            <div className='right-container'>
                <div className='right-container-header'> 
                    <h2 style={{padding: '5px', color:'var(--dark-blue)'}}> 
                        Cat Board 
                    </h2>
                    <button style={{width:'fit-content'}} onClick={() => setShowFav(!showFav)}>
                        {showFav ? 'Show All' : 'Favorites'}
                    </button>

                {sortLocation && ( 
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '50px'}}>
                        <p>Showing location: {sortLocation} ({filteredCats.length}) </p>
                        <button style={{height:'fit-content'}} onClick={() => setSortLocation('')} > Show All </button> 
                    </div>
                )}                 

            </div>
                <div className='right-container-bottom' id='brag'>
                  
                    {visibleCats.map((cat) => 
                    <CatCard 
                        key={cat.id} 
                        cat={cat} 
                        handleLocation={handleLocation}   
                        handleFav={onFav}  
                    /> )}

                    {!sortLocation && !showFav && (
                        <span
                        className='add-card-box'
                        title='Click to Add'
                        onClick={() => setShowAddModal(true)}
                        >
                        <Camera size={50}/>
                        </span>
                    )}
                    
                    {showAddModal && (
                        <div className='modal-background' onClick={() => setShowAddModal(false)}>
                            <div className='modal-content' onClick={(event) => event.stopPropagation()}>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                    />
                                    <input
                                        type='number'
                                        placeholder='Age'
                                        value={age}
                                        onChange={(event) => setAge(event.target.value)}
                                        required
                                    />
                                    <textarea
                                        placeholder='Description'
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                    />
                                    <input
                                        type='text'
                                        placeholder='Location'
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                        required
                                    />
                                    <button type='submit'>Add cat</button>
                                    <button type='button' onClick={() => setShowAddModal(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}
                 
                </div>
            </div>
        </>
    );
}

export default BragBoard