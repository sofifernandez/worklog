const ErrorMessage = ({ mensajeError, handleAlertClose }) => {
    return (
        <div>
            {
                Array.isArray(mensajeError) ? (
                    mensajeError.length > 0 && mensajeError.map((error, index) => (
                        <div key={index} className='alert alert-danger alert-dismissible fade show' role='alert'>{error}
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleAlertClose(index)}></button>
                        </div>
                    ))
                ) : (
                    <div className='alert alert-danger alert-dismissible fade show' role='alert'>{mensajeError}
                        <button type="button" className="btn-close"  data-bs-dismiss="alert" aria-label="Close" onClick={handleAlertClose}></button>
                    </div>
                )
            }
        </div>
    );
};

export default ErrorMessage;