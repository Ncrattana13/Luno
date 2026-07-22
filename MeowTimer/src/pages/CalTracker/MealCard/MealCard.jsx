import { useState } from 'react';
import './MealCard.css'

function MealCard( {meal, dishes, edit, remove} ){

    return(
         <div className='day-box'>
            <h4>{meal}</h4>
            <ul>
                {dishes.map((dish) => (
                    <li key={dish.timeStamp}>
                        {dish.name} - {dish.kcal} kcal
                        {edit && <button onClick={() => remove(dish.timeStamp)}>x</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MealCard