import '../../style/adminIndexComponent.css'
import iconoPersonas from '../../Images/people.jpeg';
import iconoObras from '../../Images/obras.jpeg'
import iconoReportes from '../../Images/reporte2.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';


export const AdminIndexComponent = () => {

  const { personaRolLoggeado } = useAuth();
  console.log(personaRolLoggeado)

  return (
    <div className="container mt-5 mx-auto">
      <div className='row'>
        <div className="col-12 col-lg-4 mb-4">
          <div class="card cardsAdmin" style={{ width: '18rem' }}>
            <img class="card-img-top" src={iconoPersonas} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">PERSONAS</h5>
              <p class="card-text">Gestión de personas, usuarios y roles.</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Agregar nueva persona <span><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span></li>
              <li class="list-group-item">Buscar</li>
              <li class="list-group-item">Asignar o editar roles</li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-lg-4 mb-4 ">
          <div class="card cardsAdmin" style={{ width: '18rem' }}>
            <img class="card-img-top" src={iconoObras} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">OBRAS</h5>
              <p class="card-text">Gestión de obras.</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Agregar nueva obra <span><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span></li>
              <li class="list-group-item">Buscar</li>
              <li class="list-group-item">Asignar jefe de obra</li>
            </ul>

          </div>
        </div>
        <div className="col-12 col-lg-4 mb-4 ">
          <div class="card cardsAdmin" style={{ width: '18rem' }}>
            <img class="card-img-top" src={iconoReportes} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">REPORTES</h5>
              <p class="card-text">Generación de reportes.</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Generar un nuevo reporte <span><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span></li>
              <li class="list-group-item">Historial</li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminIndexComponent;