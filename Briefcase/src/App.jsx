import Footer from './Home/Footer.jsx';
import Header from './Home/Header.jsx';
import BORcard from './Home/BORcard.jsx';
import AIcard from './Home/AIcard.jsx';
import ConstAmmend from './Home/ConstAmmendCard.jsx';
import Intro from './Home/Intro.jsx';

function App() {
    return(
        <>
            <Header />
            <br></br>
            <Intro />
            <BORcard />
            <AIcard />
            <ConstAmmend />
            <br></br>
            <br></br>
            <Footer />   
        </> 
    );
}

export default App