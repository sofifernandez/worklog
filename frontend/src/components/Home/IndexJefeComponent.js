
import { useAuth } from '../../context/AuthContext';


export const IndexJefeComponent = () => {

  const { personaRolLoggeado } = useAuth();
  console.log(personaRolLoggeado)

  return (
    <div className="container mt-5 mx-auto">
        <div>UN DIV DE TRABAJADOR</div>
    </div>
  )
}

export default IndexJefeComponent;