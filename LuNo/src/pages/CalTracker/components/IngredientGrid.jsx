function IngredientGrid({
    ingredients,
    changeAmountId,
    amountValue,
    onAmountChange,
    onStartEdit,
    onConfirm,
    onCancel,
    getTitle,
    showRemove = false,
    onRemove,
    showAddButton = false,
    onAddButtonClick,
    style,
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px', ...style }}>
            {ingredients.map((ingredient) => (
                <div key={ingredient.id} style={{ display: 'flex', flexDirection: 'row' }}>
                    <button onClick={() => onStartEdit(ingredient)} title={getTitle(ingredient)}>
                        {ingredient.name} ({ingredient.unit})
                    </button>

                    {changeAmountId === ingredient.id && (
                        <>
                            <input
                                style={{ width: '30px' }}
                                value={amountValue}
                                onChange={onAmountChange}
                            />

                            <button onClick={() => onConfirm(ingredient)}>add</button>
                            <button onClick={onCancel}>cancel</button>
                        </>
                    )}

                    {showRemove && <button onClick={() => onRemove(ingredient.id)}>x</button>}
                </div>
            ))}
            {showAddButton && <button onClick={onAddButtonClick}> + </button>}
        </div>
    );
}

export default IngredientGrid
