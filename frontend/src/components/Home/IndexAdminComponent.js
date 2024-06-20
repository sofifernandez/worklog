import '../../style/adminIndexComponent.css'
import iconoPersonas from '../../Images/people.jpeg';
import iconoObras from '../../Images/obras.jpeg'
import iconoReportes from '../../Images/reporte2.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'


export const AdminIndexComponent = () => {

  const { personaRolLoggeado } = useAuth();
  console.log(personaRolLoggeado)

  return (
    <div className="container mt-5 mx-auto justify-content-center">
      <div className='row justify-content-center'>
        <div className="col-8 col-lg-4 mb-4 justify-content-center">
          <div className="card cardsAdmin">
            <img className="card-img-top" src={iconoPersonas} alt="Card image cap" />
            <div className="card-body">
              <h5 className="card-title">PERSONAS</h5>
              <p className="card-text">Gestión de personas y roles.</p>
            </div>
            <ul className="list-group list-group-flush">
              <Link title='Ir' to ='/personas' className='no-decoration'><li className="list-group-item itemLink">Ver listado/Buscar</li></Link>
              <Link title='Ir' to ='/add-persona' className='no-decoration'><li className="list-group-item itemLink">Agregar nueva persona</li></Link>
              <Link title='Ir' to ='/assign-rol' className='no-decoration'><li className="list-group-item itemLink">Asignar o Editar roles</li></Link>
            </ul>
          </div>
        </div>
        <div className="col-8 col-lg-4 mb-4 ">
          <div className="card cardsAdmin">
            <img className="card-img-top" src={iconoObras} alt="Card image cap" />
            <div className="card-body">
              <h5 className="card-title">OBRAS</h5>
              <p className="card-text">Gestión de obras.</p>
            </div>
            <ul className="list-group list-group-flush">
              <Link title='Ir' to ='/obras' className='no-decoration'><li className="list-group-item itemLink">Ver listado/Buscar</li></Link>
              <Link title='Ir' to ='/add-obra' className='no-decoration'><li className="list-group-item itemLink">Agregar nueva obra</li></Link>
              <Link title='Ir' to ='/assign-jefeObra' className='no-decoration'><li className="list-group-item itemLink">Asignar Jefe de Obra</li></Link>
            </ul>

          </div>
        </div>
        <div className="col-8 col-lg-4 mb-4 ">
          <div className="card cardsAdmin">
            <img className="card-img-top" src={iconoReportes} alt="Card image cap" />
            <div className="card-body">
              <h5 className="card-title">REPORTES</h5>
              <p className="card-text">Generación de reportes.</p>
            </div>
            <ul className="list-group list-group-flush">
            <Link title='Ir' to ='/' className='no-decoration'><li className="list-group-item itemLink">Generar un nuevo reporte</li></Link>
            <Link title='Ir' to ='/' className='no-decoration'><li className="list-group-item itemLink">Historial</li></Link>
            <Link title='Ir' to ='/' className='no-decoration'><li className="list-group-item itemLink">Configuración</li></Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminIndexComponent;