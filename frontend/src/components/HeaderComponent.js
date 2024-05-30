import React from 'react'

const HeaderComponent = () => {
  return (
    <div>
        <header>
            <nav className='navbar navbar-expand-md navbar-light bg-light'>
                <div className='container'>
                    <h2>APP v1.0</h2>
                    <a href='/personas' className='btn btn-primary'>Personas</a>
                    <a href='/rol' className='btn btn-primary'>Asignar rol a persona</a>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default HeaderComponent