function SelectedIngredientChips({ ingredients, onRemove }) {
    return (
        <>
            {ingredients.map((ingredient) => (
                <div key={ingredient.timeStamp}>
                    <button onClick={() => onRemove(ingredient.timeStamp)}>
                        {ingredient.newAmount}{ingredient.unit} {ingredient.name} - {ingredient.newKcal} kcal  x
                    </button>
                </div>
            ))}
        </>
    );
}

export default SelectedIngredientChips
