import { BrowserRouter, Routes, Route } from "react-router-dom";

import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Card from './Card.jsx';
import About from './About.jsx';

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route
                    path="/"
                    element={<Card />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;