import { Link } from 'react-router-dom';
import Footer from './Home/Footer.jsx';
import Header from './Home/Header.jsx';
import BORcard from './Home/BORcard.jsx';
import AIcard from './Home/AIcard.jsx';
import ConstAmmend from './Home/ConstAmmendCard.jsx';

function App() {
    return (
        <div className="home-page">
            <Header />
            <main className="home-main">
                <section className="home-hero" aria-labelledby="home-title">
                    <div className="home-hero-copy">
                        <p className="home-eyebrow"><span aria-hidden="true"></span> Legal information, within reach</p>
                        <h2 id="home-title">Know your rights.<br />Find your next step.</h2>
                        <p className="home-lead">
                            Explore clear, approachable resources for understanding the law and making more informed decisions.
                        </p>
                        <Link className="home-primary-link" to="/AI">
                            Ask Ben <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className="home-hero-art" aria-hidden="true">
                        <div className="home-orbit home-orbit-outer"></div>
                        <div className="home-orbit home-orbit-inner"></div>
                        <div className="home-art-center">
                            <span className="home-art-mark">B</span>
                            <span>YOUR LEGAL TOOLKIT</span>
                        </div>
                        <div className="home-art-note home-art-note-top">Understand</div>
                        <div className="home-art-note home-art-note-bottom">Take action</div>
                    </div>
                </section>

                <section className="home-resources" aria-labelledby="resources-title">
                    <div className="home-section-heading">
                        <div>
                            <p className="home-eyebrow">Explore the toolkit</p>
                            <h2 id="resources-title">A good place to start</h2>
                        </div>
                        <p>Choose a resource and explore at your own pace.</p>
                    </div>
                    <div className="home-resource-grid" aria-label="Legal resources">
                        <BORcard />
                        <AIcard />
                        <ConstAmmend />
                    </div>
                </section>

                <aside className="home-disclaimer" aria-label="Legal information notice">
                    <span className="home-disclaimer-mark" aria-hidden="true">i</span>
                    <p><strong>Information, not legal advice.</strong> Briefcase Pocket Lawyer is an educational resource, not a law firm or substitute for advice from a qualified attorney.</p>
                    <Link to="/about">About Briefcase <span aria-hidden="true">&rarr;</span></Link>
                </aside>
            </main>
            <Footer />
        </div>
    );
}

export default App;
