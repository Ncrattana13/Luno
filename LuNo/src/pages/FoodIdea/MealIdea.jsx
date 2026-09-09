import { useState } from "react";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import catWorkout from '../../img/workout.png';
import catRecipe from '../../img/cat-recipe.png';
import LeftNav from "../../components/LeftNav";
import { parseIngredients, FindRecipesByIngredients, GetMealDetails, extractIngredients } from "./MealIdea.helpers";
import "./MealIdea.css";

// loose match so "chicken" also covers "chicken breast", "chicken thighs", etc.
function isIngredientOnHand(recipeIngredient, haveList) {
    const name = recipeIngredient.toLowerCase();
    return haveList.some((have) => name.includes(have) || have.includes(name));
}

function MealIdea() {
    const history = useHistory();
    const [ingredientInput, setIngredientInput] = useState('');
    const [haveList, setHaveList] = useState([]);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedMeal, setSelectedMeal] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    async function handleSearch() {
        const ingredients = parseIngredients(ingredientInput);
        if (ingredients.length === 0) return;

        try {
            setLoading(true);
            setError(null);
            const results = await FindRecipesByIngredients(ingredients);
            setHaveList(ingredients.map((i) => i.toLowerCase()));
            setMeals(results);
        } catch (err) {
            setError(err.message);
            setMeals([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectMeal(idMeal) {
        setSelectedMeal({ idMeal }); // opens the modal immediately with a loading state
        setSelectedIngredients([]);
        setModalError(null);
        setModalLoading(true);

        try {
            const details = await GetMealDetails(idMeal);
            if (!details) throw new Error("Recipe not found");
            setSelectedMeal(details);
            setSelectedIngredients(extractIngredients(details));
        } catch (err) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    }

    const closeModal = () => {
        setSelectedMeal(null);
        setSelectedIngredients([]);
        setModalError(null);
    };

    return (
        <>
            <LeftNav
                icon={catRecipe}
                buttons={[
                    { label: "Timer", icon: catClock, onClick: () => history.push("/test-timer") },
                    { label: "Board", icon: catBrag, onClick: () => history.push("/brag-board") },
                    { label: "Calories Tracker", icon: catWorkout, onClick: () => history.push("/cal-tracker") },
                    { label: "Watch List", icon: catImage, onClick: () => history.push("/watch-list") },
                    { label: "Meal Idea", icon: catRecipe, selected: true },
                ]}
            />

            <div className='right-container'>
                <div className='right-container-header'>
                    <p>{dayjs().format('ddd, MMM DD YYYY hh:mm')}</p>
                    <h2>What's in your fridge?</h2>
                </div>

                <div className="meal-idea-search">
                    <input
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="e.g. chicken, egg, shrimp"
                    />
                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? "Searching..." : "Find Recipes"}
                    </button>
                </div>

                <div className='right-container-bottom'>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {error && <p className="meal-idea-error">{error}</p>}

                        {!loading && !error && meals.length === 0 && (
                            <p className="meal-idea-hint">Search one or more ingredients (comma separated) to get recipe ideas.</p>
                        )}

                        <div className="meal-idea-grid">
                            {meals.map((meal) => (
                                <button
                                    key={meal.idMeal}
                                    className="meal-idea-card"
                                    onClick={() => handleSelectMeal(meal.idMeal)}
                                    title={meal.strMeal}
                                >
                                    <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-idea-thumb" />
                                    <span>{meal.strMeal}</span>
                                    <span className="meal-idea-match-badge">
                                        (Matches {meal.matchCount}/{haveList.length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedMeal && (
                <div className="modal-background" onClick={closeModal}>
                    <div className="modal-content meal-idea-modal-content" onClick={(event) => event.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>

                        {modalLoading && <p>Loading recipe...</p>}
                        {modalError && <p className="meal-idea-error">{modalError}</p>}

                        {!modalLoading && !modalError && (
                            <div className="meal-idea-modal-body">
                                <img
                                    src={selectedMeal.strMealThumb}
                                    alt={selectedMeal.strMeal}
                                    className="meal-idea-modal-image"
                                />

                                <div className="meal-idea-modal-details">
                                    <h2>{selectedMeal.strMeal}</h2>

                                    <ul className="meal-idea-ingredient-list">
                                        {selectedIngredients.map(({ name, measure }) => {
                                            const have = isIngredientOnHand(name, haveList);
                                            return (
                                                <li
                                                    key={name}
                                                    className={have ? "meal-idea-ingredient have" : "meal-idea-ingredient missing"}
                                                >
                                                    {name}{measure ? ` — ${measure}` : ''}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <a
                                        className="meal-idea-more-details"
                                        href={`https://www.themealdb.com/meal/${selectedMeal.idMeal}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        More details ↗
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default MealIdea
