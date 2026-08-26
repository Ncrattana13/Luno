export const addCat = (inputName, inputAge, inputDes, inputLocation, cats, setCats) => {
    const cat = {
        id: Date.now(),
        name: inputName,
        age: inputAge,
        description: inputDes,
        location: inputLocation,
        fav: false,
    }
    setCats([...cats, cat])
}

export const handleFav = (id, cats, setCats) => {
    setCats(
        cats.map(cat =>
            cat.id === id ? { ...cat, fav: !cat.fav } : cat
        )
    );
}