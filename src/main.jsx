import {createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route} from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Error404 from './Components/Error404/Error404.jsx'
import Grid from './Components/Grid/Grid.jsx'
import Photo from './Components/PhotoStuff/Photo/Photo.jsx'
import PhotoEdit from './Components/PhotoStuff/PhotoEdit/PhotoEdit.jsx'
import PhotoUpload from './Components/PhotoStuff/PhotoUpload/PhotoUpload.jsx'
import Photos from './Components/PhotoStuff/Photos/Photos.jsx'
import Tags from './Components/TagStuff/Tags/Tags.jsx'
import Tag from './Components/TagStuff/Tag/Tag.jsx'
import TagEdit from './Components/TagStuff/TagEdit/TagEdit.jsx'
import TagCreate from './Components/TagStuff/TagCreate/TagCreate.jsx'
import Store from './Components/StoreStuff/Store/Store.jsx'
import Product from './Components/StoreStuff/Product/Product.jsx'
import ProductEdit from './Components/StoreStuff/ProductEdit/ProductEdit.jsx'
import ProductCreate from './Components/StoreStuff/ProductCreate/ProductCreate.jsx'
import Login from './Components/Login&Logout/Login.jsx'
import Logout from './Components/Login&Logout/Logout.jsx'
import About from './Components/About/About.jsx'

const router = createBrowserRouter(
  [
    {
      path:'/',
      element:<App />,
      errorElement: <Error404 />,
      children:
      [
        {index:true, element:<Photos />},
        {path:'about', element:<About />},
        {path:'photos', element:<Photos />},
        {path:'tags', element:<Tags />},
        {path:'store', element:<Store />},
        {path:'store/:productID', element:<Product />},
        {path:'store/:productID/edit', element:<ProductEdit />},
        {path:'store/create', element:<ProductCreate />},
        {path:'tag/:tagID', element:<Tag />},
        {path:'tag/:tagID/edit', element:<TagEdit />},
        {path:'tag/create', element:<TagCreate />},
        {path:'photo/:photoID', element:<Photo />},
        {path:'photo/:photoID/edit', element:<PhotoEdit />},
        {path:'photo/upload', element:<PhotoUpload />},
        {path:'login', element:<Login />},
        {path:'logout', element:<Logout />},
        {path:'*', element:<Error404 />}
      ]
    },
  ]);

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
);
