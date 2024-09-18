import { useState, useEffect, useRef } from 'react'
import CookieConsent from "react-cookie-consent"
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
      <CookieConsent
        location="bottom"
        buttonText="Agree"
        declineButtonText="Decline"
        cookieName="myAppCookieConsent"
        style={{ background: "#242424", color: "#FFF" }}
        //buttonStyle={{ color: "#4e503b", fontSize: "14px" }}
        declineButtonStyle={{ fontSize: "14px" }}
        expires={150}
      >
        We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic.
      </CookieConsent>
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
                  image = <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+ElEQVR4nOWXsUscURDGN/EfSJciCgaEhNgHDN7N7BICFhKbN7Nil8pgZWWZ1ip1GhtLDQkoBCHKzHpY2AmBQAobBUETDIqmilx4Xu72PG/dPe/tmuDAa+bNvu/3vnlvl/W8/yqq3h0Qeg7Ccyj0FYUOUfknKn8B4Xdl5VJu2iDjj1G5gsrVlPG5FJmHTsX9KAxA6CiD+N9B34PIPHUjvhYOovDxVYJ2xyAv74HQGAh9q0OAcH936tU3d0F4M23HzZYHq+F9VNq1eVBe6Uq/rDyS1XZQ/lFWGrXPgYTT9XxZzdA1T7uZRKGd7H0/h9iyj/sRv2jkhLZ9Na860kelt50IN4mdodBewtxs5kMHdqFrAKS489te5fTdR+GUa/HYBX6dKBysmyeotIxKi8GqeeA5DpCJXlB+j8JLl5zwre1KJzXKiV4vpyhF3FdrB53YDcd0yit1m2Ji2nBof6W+biMn9Ok8YRZMDwr/agVw3f/WdUH41GrXkk2v2qIArGajBaj8sXgA+hCfAfupFT5oLswravbTvr9mHl2YADEDqDSfPwDNW60MhZxLCzog5X8HwI/4Wes8iBmOrxTNthvOALyUmm7WSIyrrlCbmpmEURhAtV0rCmsBJtQ5AwAxw63z9iekzWnPpwV409cQbytAxRmA0HrHAEXFH8osaCbBw5yVAAAAAElFTkSuQmCC' alt='Green hosting' title='Green hosting' />
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
