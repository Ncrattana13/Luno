    export const addConsumed = (newFood, setConsumed, selectedDate, consumed) => {
        const loggedFood = {
            ...newFood,
            date: selectedDate.format("ddd, MM/DD/YYYY"),
        };
        setConsumed([...consumed, loggedFood]);
    };

export const toggleAddFood = (
    addFood,
    setAddFood,
    setPantry,
    setAddDish,
    setCreateDish,
    setCreateIngredient,
    setChangeAmountId,
    setNewAmount,
    setSelectedIngredients,
    setActiveMeal
) => {
    if (addFood) {
        setPantry(false);
        setAddDish(false);
        setCreateDish(false);
        setCreateIngredient(false);
        setChangeAmountId(null);
        setNewAmount(0);
        setSelectedIngredients([]);
        setActiveMeal('')
    }
    setAddFood(!addFood);
};

export const togglePantry = (
    pantry,
    setPantry,
    setAddBlock,
    setAddDish,
    setCreateDish,
    setCreateIngredient,
    setChangeAmountId,
    setNewAmount,
    setSelectedIngredients
) => {
    if (pantry) {
        setAddBlock(false);
        setAddDish(false);
        setCreateDish(false);
        setCreateIngredient(false);
        setChangeAmountId(null);
        setNewAmount(0);
        setSelectedIngredients([]);
    }
    setPantry(!pantry);
};

export const toggleAddBlock = (
    addBlock,
    setAddBlock,
    setAddDish,
    setCreateDish,
    setCreateIngredient,
    setChangeAmountId,
    setNewAmount,
    setSelectedIngredients
) => {
    if (addBlock) {
        setAddDish(false);
        setCreateDish(false);
        setCreateIngredient(false);
        setChangeAmountId(null);
        setNewAmount(0);
        setSelectedIngredients([]);
    }
    setAddBlock(!addBlock);
};

export const validateRequired = (value, setError) => {
    if (!value || !value.toString().trim()) {
        setError(false);
        setTimeout(() => setError(true), 10); 
        return false;
    }
    setError(false);
    return true;
};