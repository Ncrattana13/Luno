import NavButton from "./NavButton";

function LeftNav({ icon, buttons }) {
    return (
        <div className="left-container">
            <div className="home-buttons">
                <img style={{ width: '120px', alignSelf: 'center' }} src={icon} />
                {buttons.map((button, index) => (
                    <NavButton key={index} {...button} />
                ))}
            </div>
        </div>
    );
}

export default LeftNav
