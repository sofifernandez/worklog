const ErrorMessage = ({ mensajeError }) => {
    return (
        <div>
            {
                Array.isArray(mensajeError) ? (
                    mensajeError.length > 0 && mensajeError.map((error, index) => (
                        <div key={index} className='alert alert-light' role='alert'>{error}</div>
                    ))
                ) : (
                    <div className='alert alert-danger' role='alert'>{mensajeError}</div>
                )
            }
        </div>
    );
};

export default ErrorMessage;