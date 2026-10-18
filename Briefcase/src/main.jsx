import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Home.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import About from './About/About.jsx'
import BillOfRights from './Bill-Of-Rights/bill-of-rights.jsx'
import AI from './AI Display/AI.jsx'
import ConstAmmend from './Constitutional Ammendments/ConstAmmend.jsx'
import Intro from './Home/Intro.jsx'
import Demo from './Demo/Demo.jsx'
import LoginPage from './Login/loginpage.jsx'
import { AuthProvider } from './AuthContext.jsx';
import DocuHelp from './Documents/DocuHelp.jsx';

const router = createBrowserRouter([
  {path: "/",element: <Intro />},
  {path: "/Home",element: <App />},
  {path: "/about",element: <About />},
  {path: "/bill-of-rights",element: <BillOfRights />},
  {path: "/AI",element: <AI />},
  {path: "/constitutional-amendments",element: <ConstAmmend />},
  {path: "/demo",element: <Demo />},
  {path: "/login",element: <LoginPage />},
  {path: "/docuhelp",element: <DocuHelp />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
