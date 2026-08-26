import { useState } from 'react';
import './MealCard.css'

function MealCard( {meal, dishes, edit, remove} ){

    return(
         <div className='day-box'>
            <div>
                <h4>{meal}</h4>
                <ul>
                    {dishes.map((dish) => (
                        <li key={dish.timeStamp} title={dish.ingredients?.map(i => `${i.name} (${i.newAmount ?? i.amount}${i.unit})`).join('\n')}>
                            {dish.name} - {dish.kcal} kcal
                            {edit && <button onClick={() => remove(dish.timeStamp)}>x</button>}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{alignSelf: 'center'}}>
                <p>Calories: {dishes.reduce((sum, dish) => sum + dish.kcal, 0)}</p>
            </div>

        </div>
    );
}

export default MealCard