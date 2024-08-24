import React, { useState, useEffect, } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import UsuarioService from '../../services/UsuarioService';

const ChangePassword = () => {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const { id } = useParams()
    const navigate = useNavigate();
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search);
    const data = queryParams.get('data') === 'true'

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrors('Las contraseñas no coinciden.');
            return;
        }
        try {
            const response = await UsuarioService.updatePassword(id, newPassword);
            navigate('/home');
        } catch (error) {
            setErrors(error.response?.data || 'Ocurrió un error al actualizar la contraseña.');
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div className='col-md-6'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='text-center'>Actualizar Contraseña</h2>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handlePasswordChange}>
                            {errors && <div className="alert alert-danger mb-3" role="alert">{errors}</div>}
                            <div className='form-group'>
                                <label className="form-label">Nueva Contraseña:</label>
                                <input
                                    type="text"
                                    id="newPassword"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-label">Confirmar Nueva Contraseña:</label>
                                <input
                                    type="text"
                                    id="confirmPassword"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div  className="d-flex justify-content-start mt-3">
                                <button type="submit" className='btn btn-primary m-2 '>Actualizar Contraseña</button>
                                {data &&
                                    <Link to={`/edit-persona/${id}`} className='btn btn-danger m-2 '>Volver</Link>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;