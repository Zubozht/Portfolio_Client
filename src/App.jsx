import {Outlet} from 'react-router-dom'
import MainContainer from './Components/MainContainer/MainContainer.jsx'
import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'
import { ApiContext } from './ApiContext.jsx'

function App() {

  const apiurl = "https://api.marchenkophoto.com";
  //const apiurl = "http://localhost:5100"

  return (
    <ApiContext.Provider value={apiurl}>
      <Header/>
      <MainContainer>
        <Outlet/>
      </MainContainer>
      <Footer/>
    </ApiContext.Provider>
  )
}

export default App