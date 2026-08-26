function NavButton({ label, icon, onClick, selected, wrap }) {
    const button = (
        <button onClick={onClick}>
            <span>{label}</span>
            <img src={icon} />
        </button>
    );

    if (selected) return <div className="select-button">{button}</div>;
    if (wrap) return <div>{button}</div>;
    return button;
}

export default NavButton
