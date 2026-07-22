import { useEffect, useState } from "react";
import dayjs from "dayjs";
import catWorkout from '../../img/workout.png'
import "../../App.css"
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import { useHistory } from "react-router-dom";
import './MealCard/MealCard.css'
import MealCard from "./MealCard/MealCard";
import { addConsumed } from "./CalTracker.helpers";

function CalTracker(){
    const history = useHistory();
    const [activeMeal, setActiveMeal] = useState("Breakfast");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [cal, setCal] = useState(0);
    const [edit, setEdit] = useState(false);
    const [addFood, setAddFood] = useState(false);

    const [consumed, setConsumed] = useState(() => {
        const saved = localStorage.getItem("consumed");
        if (!saved || saved === "undefined") {
            return [];
        }

        return JSON.parse(saved);
    });

    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem("items");
        if (!saved || saved === "undefined" || saved === "[]") {
            return [
                {
                id: Date.now(), 
                name: "Konjac Jelly", 
                kcal: 4, 
                serving: 1, 
                size: 150 ,
                date: "Thu, 07/14/2026"},
            ];
        }

        return JSON.parse(saved);
    });
    
    const [inputName, setInputName] = useState(''); 
    const [inputKcal, setInputKcal] = useState(0);
    const [inputServing, setInputServing] = useState(0);
    const [inputSize, setInputSize] = useState(0);

    
    const [inputSearch, setInputSearch] = useState('')
    useEffect(() => {

    }, [inputSearch]);

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(inputSearch.toLowerCase())
    );

    

    const [addBlock, setAddBlock] = useState(false);

    // const [items, setItems] = useState([]);
    const [pantry, setPantry] = useState(false);
    const openPantry = () => {
        setPantry(!pantry);
    }

    const addItem = (name, kcal, serving, size) => {
        const newItem = {
            id: Date.now(),
            name: name,
            kcal: Number(kcal),
            serving: Number(serving),
            size: Number(size),
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) =>{
        setItems(items.filter(item => item.id !== id));
    }

    const removeConsumed = (timeStamp) => {
        setConsumed(consumed.filter(consumed => consumed.timeStamp !== timeStamp));
    }

    const handleAddClick = () => {
        addItem(inputName, inputKcal, inputServing, inputSize);
        setInputName('');
        setInputKcal(0);
        setInputServing(0);
        setInputSize(0);
        setAddBlock(false);
    };

    const showAdd = () => {
        setAddBlock(!addBlock);
    }

    const todaysFood = consumed.filter(
        (food) => food.date === selectedDate.format("ddd, MM/DD/YYYY")
    );

    useEffect(() => {
        setCal(todaysFood.reduce((sum, food) => sum + food.kcal, 0));
    }, [todaysFood]);

    useEffect(() => {
        localStorage.setItem("consumed", JSON.stringify(consumed));
        localStorage.setItem("items", JSON.stringify(items));

    }, [items, consumed]);



    return (
        <>
            <div className='left-container'>
                <div className="home-buttons">
                    <img style={{width: '120px', alignSelf: 'center'}} src={catWorkout} />
                        <button onClick={() => history.push("/test-timer")}>
                            <span>Timer</span> 
                            <img src={catClock} />
                        </button>

                        <div>
                            <button onClick={() => history.push("/brag-board")}>
                                <span>Board</span>
                                <img src={catBrag} />
                            </button>
                        </div>

                        <div className='select-button'>
                        <button >
                            <span>Calories Tracker</span>
                            <img src={catWorkout} />
                        </button>
                        </div>
                        <button onClick={() => history.push("/")}>
                            <span>#4</span>
                            <img src={catImage} />
                        </button>
                </div>
                    
            </div>

            <div className='right-container'>
                <h2>Date: {selectedDate.format("ddd, MMM DD YYYY")}</h2>
                <div className='right-container-header' id='cal-tracker-top'> 
                    
                        <input
                            type="date"
                            value={selectedDate.format("YYYY-MM-DD")}
                            onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                        />                    
                    
                    
                  
                        <h3> Total Calories: {cal} </h3>
                
                    
                </div>

                <div style={{display: 'flex', justifyContent: "space-between", paddingRight: '5%'}}>
                    <span><button style={{height: "25px"}} onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}> ◀ </button> </span>
                    <div className='food-container'> 
                        <MealCard
                            meal="Breakfast"
                            dishes={todaysFood.filter((f) => f.mealType === "Breakfast")}
                            edit={edit}
                            remove={removeConsumed}
                        />
                        <MealCard
                            meal="Lunch"
                            dishes={todaysFood.filter((f) => f.mealType === "Lunch")}
                            edit={edit}
                            remove={removeConsumed}
                        />
                        <MealCard
                            meal="Dinner"
                            dishes={todaysFood.filter((f) => f.mealType === "Dinner")}
                            edit={edit}
                            remove={removeConsumed}
                        />
                    </div>
                    <span><button style={{height: "25px"}} onClick={() => setSelectedDate(selectedDate.add(1, "day"))}> ▶ </button> </span>
                </div>

                <div className='right-container-bottom' id='cal-tracker-bottom' >
                    <div style={{display: 'flex', justifyContent: 'flex-end', padding: '30px 80px'}}>
                        {!edit && (<button onClick={() => setEdit(true)}>Edit</button>)}
                        {edit && (<button onClick={() => setEdit(false)}>Done</button>)}
                    </div>
                    {/* <div>
                    {todaysFood.map((food) => 
                        <>
                        <button>{food.name} {food.kcal} kcal</button>
                        <button onClick={() => removeConsumed(food.timeStamp)}>x</button>
                        </>
                    )}
                    </div> */}
                    <div style={{ display: "flex", gap: "6px", paddingTop: "10px" }}>
                        {["Breakfast", "Lunch", "Dinner"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setActiveMeal(m)}
                                style={{
                                    fontWeight: activeMeal === m ? "bold" : "normal",
                                    background: activeMeal === m ? "var(--red)" : "var(--dark-blue)",
                                    }}                            
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    
                        
                    <div style={{paddingTop:'20px'}}> 
                        <button onClick={()=> setAddFood(true)}>Add Food</button>
                        <button onClick={openPantry}> Your Pantry </button>
                    </div>
                    
                    {addFood && (
                        <div>
                            <div style={{display: 'flex', padding: '10px 0', gap: '15px'}}>
                                <input value={inputName} 
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder="Food name" />
                        
                                <input value={inputName} 
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder="kcal" />
                            </div>
                        
                            <div>
                                <button> Add </button>  
                                <button onClick={() => setAddFood(false)}> Cancel </button>
                            </div>
                        </div>
                    )}

                    {pantry && (<div> 

                        <h2> Your items:</h2>
                        <input
                            style={{marginBottom:'10px'}}
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            placeholder="Search your pantry..."
                        />

                        <div style={{display:'flex', flexDirection:'row', flexWrap: 'wrap', gap: '5px'}}>
                        {filteredItems.map((item) => (
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <button onClick={() => addConsumed({ ...item, timeStamp: Date.now(), mealType: activeMeal }, setConsumed, selectedDate, consumed)}>
                                    {item.name} - {item.kcal} kcal
                                </button>
                                <button onClick={() => removeItem(item.id)}>x</button>
                            </div>
                    
                        ))}
                        </div>

                        <div style={{padding: '15px 0'}}> 
                            <button onClick={showAdd}> Add item to your pantry </button>
                        </div>

                    </div>)}

                    {addBlock && pantry && (<div>

                        <p>Food name:</p>
                        <input value={inputName} 
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="Food name" />

                        <p>kcal:</p>
                        <input value={inputKcal} 
                            onChange={(e) => setInputKcal(e.target.value)}
                            placeholder="kcal" />

                        <p>Serving(s) per package:</p>
                        <input value={inputServing} 
                            onChange={(e) => setInputServing(e.target.value)}
                            placeholder="serving per package" />

                        <p>Size(mL):</p>
                        <input value={inputSize} 
                            onChange={(e) => setInputSize(e.target.value)}
                            placeholder="size (mL)" />  
                        <div>
                            <button onClick={handleAddClick}> Add </button>
                            
                            <button onClick={showAdd}> Cancel </button>
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    );
}

export default CalTracker;