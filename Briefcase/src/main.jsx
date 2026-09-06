import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import About from './About/About.jsx'
import BillOfRights from './Bill-Of-Rights/bill-of-rights.jsx'

const router = createBrowserRouter([
  {path: "/",element: <App />},
  {path: "/about",element: <About />},
  {path: "/bill-of-rights",element: <BillOfRights />}

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
