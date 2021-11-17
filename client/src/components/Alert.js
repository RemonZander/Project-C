// Bootstrap voor alerts en extra dingen?
// Zal de workload voor styling verminderen. Bespreken met groepsleden.

const Alert = (props) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '150px' }}>
            <p>{props.text}</p>
        </div>
    );
};

export default Alert;
