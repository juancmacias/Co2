import { useState, useEffect, useRef } from 'react'
import { urlApi } from './Services/urls'
import './App.css'
import { hosting } from "@tgwf/co2"
import { format } from "date-fns"
import ReactGA from "react-ga4"

function App() {
  ReactGA.initialize("G-98DNV82Z6L")
  ReactGA.send({ hitType: "pageview", page: "/my-path", title: "Co2" })
  ReactGA.event({
    category: 'User',
    action: "Co2",
    label: "Co2",
  });
  const [ botonState, changeBotonState] = useState(true)
  const [ errorUrl, setErrorUrl] = useState('hideError')
  const [ url, setUrl ] = useState('')
  const [ urlr, setUrlR] = useState([])
  const inputRef = useRef(null)

  //const swd = new co2();
  //const declaredSwd = new co2({ model: "swd" });

  const handleUrlChange = (e) => {
    let posicionPunto = e.target.value.lastIndexOf('.')
    let valueUrl = e.target.value
    valueUrl = valueUrl.replace("http://www.", "")
    valueUrl = valueUrl.replace("https://www.", "")
    valueUrl = valueUrl.replace("www.", "")
    valueUrl = valueUrl.replace("http://", "")
    valueUrl = valueUrl.replace("https://", "")
    if (!( posicionPunto > 2 && (e.target.value.length - posicionPunto) > 2)) {
      setErrorUrl('showError')
    }else{
      setErrorUrl('hideError')
      changeBotonState(false)
      setUrl(valueUrl)
    }
  };
  const comprobarco2 = (e) => {
    e.preventDefault(); 
    inputRef.current.value = "";
    hosting.check(url).then((result) => {
      let now = new Date()
      const formData = new FormData()
        formData.append('url', url)
        formData.append('result', result)
        formData.append('date', now)
      enviar(formData)
      setUrl()
      changeBotonState(true)
      ReactGA.event({
        category: 'User',
        action: url,
        label: result,
      })
    })
  }
  const enviar = (raw) => {
    fetch(`${urlApi}api/urlsave/index.php`, {
      method: 'POST',
      body: raw
    })
    .then((response) => response.json())
    .then((data) => {
        obtenerDatos()
    })
  }
  async function obtenerDatos(){
    const data = await fetch(`${urlApi}api/urlsave/recuperar.php`);
    const users = await data.json();
    const nueva = [...users]
    nueva.reverse()
    setUrlR(nueva)
  }
  useEffect(() => {
    obtenerDatos()
  }, [])
  return (
    <div className="App">
      <section>
        <h1>¿Comprobar si tu dominio está alojado en un servidor ecológico?</h1>
        <form onSubmit={comprobarco2} autoComplete='off'>
          <input id='url' ref={inputRef} name='url' onChange={handleUrlChange}/>
          <button variant="outline-success"  type="submit" disabled={botonState}>Comprobar</button>
          <div className='espacio'>
            <span className={errorUrl}>La url no es correcta ejemplo: google.es</span>
          </div>
        </form>
        
        <div className='resultados'>
          <table>
          <thead>
            <tr key='0'>
              <th>URL</th>
              <th>Resultado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {
              urlr.slice(0, 12).map((elemento, i) => {
                var date = new Date(elemento.fecha)
                var formattedDate = format(date,  "dd-MM-yyyy")
                var image = ''
                if (elemento.result === "true"){
                  image = <img src='../ok.png' alt='Green hosting' title='Green hosting' />
                }else{
                  image = ''
                }
                return (
                  <tr id={`A${i+1}`} key={i +1}>
                    <td>
                      <a href={`http://www.${elemento.url}`} title={elemento.url} target='_blanck'>{elemento.url}</a>
                      </td>
                    <td>
                      { 
                        image
                      }
                      </td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      </section>
    </div>
  );
}

export default App;
