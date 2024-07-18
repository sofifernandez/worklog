const SuccessMessage = ({ mensajeSuccess, handleAlertClose }) => {
    return (
        <div>
            {
                Array.isArray(mensajeSuccess) ? (
                    mensajeSuccess.length > 0 && mensajeSuccess.map((error, index) => (
                        <div key={index} className='alert alert-success alert-dismissible fade show' role='alert'>{error}
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleAlertClose(index)}></button>
                        </div>
                    ))
                ) : (
                    <div className='alert alert-success alert-dismissible fade show' role='alert'>{mensajeSuccess}
                        <button type="button" className="btn-close"  data-bs-dismiss="alert" aria-label="Close" onClick={handleAlertClose}></button>
                    </div>
                )
            }
        </div>
    );
};

export default SuccessMessage;