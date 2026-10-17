import Footer from './Home/Footer.jsx';
import Header from './Home/Header.jsx';
import BORcard from './Home/BORcard.jsx';
import AIcard from './Home/AIcard.jsx';
import ConstAmmend from './Home/ConstAmmendCard.jsx';

function App() {
    return(
        <>
            <Header />
            <hr style={{ opacity: 0.3 }} />
            <br></br>
            <main>
                <section aria-labelledby="home-title">
                    <h2 id="home-title">Explore our legal resources</h2>
                    <p>Choose a tool to get started.</p>
                </section>
                <section aria-label="Legal resources">
                    <BORcard />
                    <AIcard />
                    <ConstAmmend />
                </section>
            </main>
            <br></br>
            <br></br>
            <Footer />   
        </> 
    );
}

export default App