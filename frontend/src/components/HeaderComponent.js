import React from 'react'

const HeaderComponent = () => {
    return (
        <div>
            <header>
                <nav className='navbar navbar-expand-md navbar-light bg-light'>
                    <div className='container d-flex justify-content-between align-items-center'>
                        <h2>APP v1.0</h2>
                        <div className='d-flex'>
                            <a href='/personas' className='btn btn-sm btn-primary m-1'>Personas</a>
                            <a href='/obras' className='btn btn-sm btn-primary m-1'>Obras</a>
                            <a href='/rol' className='btn btn-sm btn-primary m-1'>Asignar rol a persona</a>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default HeaderComponent