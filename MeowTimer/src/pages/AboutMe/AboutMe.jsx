import '../../App.css'
import LuNo from '../../img/LuNo.jpg'
function AboutMe(){

    return(
        <div className="me-container">
            <div>
                <h2>About Me</h2>
                <img style={{width: '40%', border:'2px solid var(--orange)', padding: '10px'}} src={LuNo} />
                <p>Hi</p>
            </div>

            
        </div>
    );
}

export default AboutMe