import { useEffect, useState } from "react";
import dayjs from "dayjs";
import catWorkout from '../../img/workout.png'
import "../../App.css"
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import catRecipe from '../../img/cat-recipe.png';
import { useHistory } from "react-router-dom";
import './MealCard/MealCard.css'
import MealCard from "./MealCard/MealCard";
import './CalTracker.css'
import { addConsumed, toggleAddFood, togglePantry, toggleAddBlock } from "./CalTracker.helpers";
import LeftNav from "../../components/LeftNav";
import LabeledField from "./components/LabeledField";
import SelectedIngredientChips from "./components/SelectedIngredientChips";
import IngredientGrid from "./components/IngredientGrid";

function CalTracker(){
    const history = useHistory();
    const [activeMeal, setActiveMeal] = useState("");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [cal, setCal] = useState(0);
    const [edit, setEdit] = useState(false);
    const [addFood, setAddFood] = useState(false);
    const [inputSearch, setInputSearch] = useState('')
    useEffect(() => {}, [inputSearch]);
    
    /*Pantry */
    const [pantry, setPantry] = useState(false);

    const [addBlock, setAddBlock] = useState(false);

    const [addDish, setAddDish] = useState(false);
    const [createDish, setCreateDish] = useState(false);
    const [createIngredient, setCreateIngredient] = useState(false);
    
    const [ingredientName, setIngredientName] = useState(''); 
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');
    const [ingredientKcal, setIngredientKcal] = useState('');
    const [ingredientProtein, setIngredientProtein] = useState('');

    const [ingredients, setIngredients] = useState(()=>{
        const saved = localStorage.getItem("ingredients");
        if (!saved | saved === "undefined") {
            return [{
                id: crypto.randomUUID(),
                name: 'Shrimp',
                amount: 10,
                unit: 'g',
                kcal: 10,
                protein: 2.3 },
                {
                id: crypto.randomUUID(),
                name: 'Boil Egg',
                amount: 1,
                unit: 'piece 50g',
                kcal: 75,
                protein: 6.2 },
                {
                id: crypto.randomUUID(),
                name: 'Boil Egg',
                amount: 10,
                unit: 'g',
                kcal: 15,
                protein: 1.3 },
            ];
        }
        return JSON.parse(saved);
    });

    const addIngredients = (inName, inAmount, inUnit, inKcal, inProtein) => {
        const newIngredient = {
            id: crypto.randomUUID(),
            name: inName,
            amount: inAmount,
            unit: inUnit,
            kcal: inKcal,
            protein: inProtein
        }
        setIngredients([...ingredients, newIngredient]);
    };

    const handleAddInClick = () => {
        addIngredients(ingredientName, Number(ingredientAmount), ingredientUnit, Number(ingredientKcal), Number(ingredientProtein));
        setIngredientName('');
        setIngredientAmount('');
        setIngredientKcal('');
        setIngredientProtein('');
        setCreateIngredient(false);
    };

    const [editIngredient, setEditIngredient] = useState(false);

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(inputSearch.toLowerCase())
    );

    const removeIngredient = (id) => {
        setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    };

    const [pantrySelectedIngredients, setPantrySelectedIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [pantryKcal, setPantryKcal] = useState(0);
    
    useEffect(() => {
        const total = pantrySelectedIngredients.reduce(
        (sum, ing) => sum + (ing.newKcal ?? ing.kcal), 0
        );
        setInputKcal(total);
    }, [pantrySelectedIngredients])

    const removeSelectedIngredient = (timeStamp) => {
        setSelectedIngredients(selectedIngredients.filter(i => i.timeStamp !== timeStamp));
    };

    const removePantrySelectedIngredient = (timeStamp) => {
        setPantrySelectedIngredients(pantrySelectedIngredients.filter(i => i.timeStamp !== timeStamp));
    };
    
    const [changeAmountId, setChangeAmountId] = useState(null);
    const [newAmount, setNewAmount] = useState(0);

    const [dishChangeAmountId, setDishChangeAmountId] = useState(null); 
    const [dishNewAmount, setDishNewAmount] = useState(0);

    const kcalCalculation = (amount, kcal, newAmount) => {
        const newKcal = (kcal/amount) * newAmount;
        return Math.ceil(newAmount === amount ? kcal : newKcal);
    };

    const handleAddDish = () => {
        const totalKcal = selectedIngredients.reduce(
            (sum, ing) => sum + (ing.newKcal ?? ing.kcal), 0);

        addItem(inputName, totalKcal, inputServing, inputSize);

        setSelectedIngredients([]);
        setInputName('');
        setInputServing(0);
        setInputSize(0);
        setCreateDish(false);
    };

    /*Consumed*/
    const [consumed, setConsumed] = useState(() => {
        const saved = localStorage.getItem("consumed");
        if (!saved || saved === "undefined") {
            return [];
        }

        return JSON.parse(saved);
    });

    /*Item in Pantry */
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
    
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(inputSearch.toLowerCase())
    );

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
        if (!inputName.trim()) return;
        addItem(inputName, inputKcal, inputServing, inputSize);
        setInputName('');
        setInputKcal(0);
        setInputServing(0);
        setInputSize(0);
        setAddBlock(false);
    };

    const handleQuickAddClick = () => {
        if (!inputName.trim()) return; // require a non-empty name

        addConsumed(
            { name: inputName, kcal: Number(inputKcal), timeStamp: Date.now(), mealType: activeMeal, ingredients: pantrySelectedIngredients },
            setConsumed,
            selectedDate,
            consumed
        );

        setInputName('');
        setInputKcal(0);
        setPantrySelectedIngredients([]);
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
        localStorage.setItem("ingredients", JSON.stringify(ingredients));


    }, [items, consumed, ingredients]);

    return (
        <>
            <LeftNav
                icon={catWorkout}
                buttons={[
                    { label: "Timer", icon: catClock, onClick: () => history.push("/test-timer") },
                    { label: "Board", icon: catBrag, onClick: () => history.push("/brag-board"), wrap: true },
                    { label: "Calories Tracker", icon: catWorkout, selected: true },
                    { label: "Watch List", icon: catImage, onClick: () => history.push("/watch-list") },
                    { label: "Meal Idea", icon: catRecipe, onClick: () => history.push("/meal-idea") },
                ]}
            />

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
                    <div>
                        <button onClick={() => toggleAddFood(addFood, setAddFood, setPantry,
                            setAddDish, setCreateDish, setCreateIngredient, setChangeAmountId, setNewAmount, setSelectedIngredients, setActiveMeal
                            )}> Add New
                        </button>
                    </div>

                    { addFood && <div style={{ display: "flex", gap: "6px", paddingTop: "10px" }}>
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
                    </div> }
                                        
                    {activeMeal && addFood && (
                        <div>
                            
                            <div style={{fontFamily:'monospace', fontSize:'10px'}}> 
                                <p> {activeMeal}:</p>
                            </div>
                            <div style={{display: 'flex', padding: '5px 0', gap: '15px'}}>
                                
                                <input value={inputName} 
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder="Food name" />
                        
                                <input value={inputKcal} 
                                    onChange={(e) => setInputKcal(e.target.value)}
                                    placeholder="kcal" />

                                <button onClick={handleQuickAddClick}> Add </button>
 
                            </div>

                            <div>
                                <SelectedIngredientChips
                                    ingredients={pantrySelectedIngredients}
                                    onRemove={removePantrySelectedIngredient}
                                />
                            </div>
                        
                           
                            <div style={{paddingTop:'20px'}}> 
                                <button
                                        className={pantry ? 'selected' : ''}
                                        onClick={() => togglePantry(pantry, setPantry, setAddBlock, setAddDish, setCreateDish, 
                                        setCreateIngredient, setChangeAmountId, setNewAmount, setSelectedIngredients)}
                                        > My Pantry </button>
                            </div>

                        </div>
                    )}

                    {addFood && pantry && (<div> 

                        <h2> Your items:</h2>
                        <input
                            style={{marginBottom:'10px'}}
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            placeholder="Search your pantry..."
                        />

                        <div style={{display:'flex', gap: '5px'}}>
                        <div className="pantry-dish">
                            <p>Menu:</p>
                            <div style={{display:'flex', flexDirection:'row', flexWrap: 'wrap', gap: '5px'}}>
                            {filteredItems.map((item) => (
                                <div key={item.id} style={{display:'flex', flexDirection:'row'}}>
                                    <button onClick={() => addConsumed({ ...item, timeStamp: Date.now(), mealType: activeMeal }, setConsumed, selectedDate, consumed)}
                                        title={(item.serving === 0 ? 'Serving: -' : 'Serving: ' + item.serving) + '\n' +
                                            (item.size === 0 ? 'Size: -' : 'Size: ' + item.size)}> 
                                        {item.name} - {item.kcal} kcal
                                    </button>
                                    {editIngredient && <button onClick={() => removeItem(item.id)}>x</button> }
                                </div>
                    
                            ))}
                            { editIngredient && <button onClick={() => setAddDish(!addDish)}> + </button> }
                            </div>
                            <div>
                                {addDish && editIngredient && (<div className="input">
                                    <p style={{fontWeight: 'bold'}}> Add new dish:</p>
                                    <LabeledField
                                        label="Food name:"
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        placeholder="e.g. Tom Yum/Pad Thai"
                                    />
                                    <LabeledField
                                        label="kcal:"
                                        value={inputKcal}
                                        onChange={(e) => setInputKcal(e.target.value)}
                                        placeholder="kcal"
                                    />
                                    <LabeledField
                                        label="Serving(s) (optional):"
                                        value={inputServing}
                                        onChange={(e) => setInputServing(e.target.value)}
                                        placeholder="serving per package"
                                    />
                                    <LabeledField
                                        label="Size(mL) (optional):"
                                        value={inputSize}
                                        onChange={(e) => setInputSize(e.target.value)}
                                        placeholder="size (mL)"
                                    />

                                    <div style={{display: 'flex', gap: '2px', paddingTop: '10px'}}>
                                        <button onClick={handleAddClick}> Add </button>
                                        <button onClick={showAdd}> Cancel </button>
                                    </div>
                                </div>)}  
                            </div>
                        </div>

                        <div className="pantry-ing">
                            <p>Ingredient(s):</p>
                            <IngredientGrid
                                ingredients={filteredIngredients}
                                changeAmountId={changeAmountId}
                                amountValue={newAmount}
                                onAmountChange={(e) => setNewAmount(e.target.value)}
                                onStartEdit={(ingredient) => { setChangeAmountId(ingredient.id); setNewAmount(ingredient.amount); }}
                                onConfirm={(ingredient) => {
                                    setPantrySelectedIngredients([...pantrySelectedIngredients, { ...ingredient, timeStamp: Date.now(), newAmount: Number(newAmount), newKcal: kcalCalculation(ingredient.amount, ingredient.kcal, Number(newAmount)) }]);
                                    setChangeAmountId(null);
                                    setNewAmount('');
                                }}
                                onCancel={() => { setChangeAmountId(null); setNewAmount(''); }}
                                getTitle={(ingredient) => `amount: ${ingredient.amount}${ingredient.unit}\nkcal: ${ingredient.kcal}\nProtein: ${ingredient.protein}g`}
                                showRemove={editIngredient}
                                onRemove={removeIngredient}
                                showAddButton={editIngredient}
                                onAddButtonClick={() => setCreateIngredient(!createIngredient)}
                            />
                            <div>
                                {createIngredient && editIngredient && (<div className="input">
                                <p style={{fontWeight: 'bold'}}> Add new ingredient:</p>
                                <LabeledField
                                    label="name"
                                    value={ingredientName}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    placeholder="e.g. Shrimp/Chicken"
                                    required
                                />
                                <LabeledField
                                    label="amount"
                                    value={ingredientAmount}
                                    onChange={(e) => setIngredientAmount(e.target.value)}
                                    placeholder="amount"
                                />
                                <LabeledField
                                    label="unit"
                                    value={ingredientUnit}
                                    onChange={(e) => setIngredientUnit(e.target.value)}
                                    placeholder="e.g. g/tsp/tbsp"
                                />
                                <LabeledField
                                    label="kcal"
                                    value={ingredientKcal}
                                    onChange={(e) => setIngredientKcal(e.target.value)}
                                    placeholder=""
                                />
                                <LabeledField
                                    label="protein"
                                    value={ingredientProtein}
                                    onChange={(e) => setIngredientProtein(e.target.value)}
                                    placeholder=""
                                />

                                <div style={{paddingTop: '10px'}}>
                                    <button onClick={handleAddInClick}> Add </button>
                                </div>
                           
                            </div>)}
                            </div>
                            
                        </div>
                            <button style={{height:'fit-content', fontWeight:'bolder', background: editIngredient ? 'var(--red)': ''}} onClick={() => setEditIngredient((!editIngredient))}>⋮</button>
                        </div>

                        <div style={{padding: '15px 0'}}> 
                            <button
                                className={addBlock ? 'selected' : ''}
                                onClick={() => {setCreateDish(!createDish);}}
                                > Create new</button>
                        </div>

                    </div>)}
                    


                    {createDish &&(
                        <div>
                            <div>
                                <p>Dish name:</p>
                                <input value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                placeholder="e.g. Tom Yum/Pad Thai" />
                                <p>Selected ingredient(s):</p>
                                <SelectedIngredientChips
                                    ingredients={selectedIngredients}
                                    onRemove={removeSelectedIngredient}
                                />
                                { selectedIngredients.length > 0 && <div style={{display: 'flex', paddingTop: '10px', gap: '4px'}}>
                                    <button onClick={handleAddDish}>Add</button>
                                    <button onClick={() => setSelectedIngredients([])}>Cancel</button>
                                </div> }


                            </div>
                            
                            <div className="pantry-ing">
                                <p>Ingredients:</p>
                                <IngredientGrid
                                    ingredients={filteredIngredients}
                                    changeAmountId={dishChangeAmountId}
                                    amountValue={newAmount}
                                    onAmountChange={(e) => setNewAmount(e.target.value)}
                                    onStartEdit={(ingredient) => { setDishChangeAmountId(ingredient.id); setDishNewAmount(ingredient.amount); }}
                                    onConfirm={(ingredient) => {
                                        setSelectedIngredients([...selectedIngredients, { ...ingredient, timeStamp: Date.now(), newAmount: Number(newAmount), newKcal: kcalCalculation(ingredient.amount, ingredient.kcal, Number(newAmount)) }]);
                                        setDishChangeAmountId(null);
                                        setDishNewAmount('');
                                    }}
                                    onCancel={() => { setDishChangeAmountId(null); setDishNewAmount(''); }}
                                    getTitle={(ingredient) => `amount: ${ingredient.amount}${ingredient.unit}\nkcal: ${ingredient.kcal}`}
                                    style={{ paddingTop: '15px' }}
                                />
                            </div>                            
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CalTracker;