import { useState, useEffect} from 'react';
import './CatCard.css';
// import unoImage from "../img/Uno.png";

function CatCard( {cat, handleLocation, handleFav} ) {    
    const [showModal, setShowModal] = useState(false);

    return(
        <div>
        <div className='card-box'>
            <div>
                {!cat.fav && <button className='like-button' onClick={() => handleFav(cat.id)} title="Like">❤︎</button>}
                {cat.fav && <button className='like-button' id="liked" onClick={() => handleFav(cat.id)} title="Unlike">❤︎</button>}
                <img onClick={() => setShowModal(true)} src={cat.pic}/>
                <p>Name: {cat.name}</p>
                <p>Age: {cat.age}</p>
                <p>Description: {cat.description} </p>
            </div>
            <div className='card-location' onClick={() => handleLocation(cat.location)} title='see more in this location'>
                <button> 𖡡 {cat.location} </button> 
            </div>

            

        </div>
        <div>

        {showModal && (
                <div className='modal-background' onClick={() => setShowModal(false)}>
                    <div className='modal-content' onClick={(event) => event.stopPropagation()}>
                        <img src={cat.pic} alt={cat.name}/>
                    </div>
                </div>

            )}
        </div>

        </div>


    );
}

export default CatCard