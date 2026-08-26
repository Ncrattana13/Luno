function LabeledField({ label, value, onChange, placeholder, required }) {
    return (
        <>
            <p>{label}</p>
            <input value={value} onChange={onChange} placeholder={placeholder} required={required} />
        </>
    );
}

export default LabeledField
