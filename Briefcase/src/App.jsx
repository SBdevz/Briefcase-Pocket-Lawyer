import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Card from './Card.jsx';

function App() {
    if (window.location.pathname === '/About') {
        return <About />;
    }

    return(
        <>
            <Header />
            <Card />
            <Footer />
        </> 
    );
}

export default App