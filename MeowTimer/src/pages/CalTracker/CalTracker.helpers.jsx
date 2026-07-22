    export const addConsumed = (newFood, setConsumed, selectedDate, consumed) => {
        const loggedFood = {
            ...newFood,
            date: selectedDate.format("ddd, MM/DD/YYYY"),
        };
        setConsumed([...consumed, loggedFood]);
    };