import { Link } from 'react-router-dom';
import Header from './Header.jsx';

function Intro() {
    return (
        <main className="intro-page">
            <Header />
            <section className="intro-hero" aria-labelledby="intro-title">
                <div className="intro-copy">
                    <p className="intro-eyebrow">A clearer place to start</p>
                    <h2 id="intro-title">Legal information, made easier to find.</h2>
                    <p className="intro-lead">
                        Briefcase Pocket Lawyer brings useful U.S. legal resources and tools together in one straightforward place.
                    </p>
                    <div className="intro-actions">
                        <Link className="intro-cta" to="/Home">Preview as a guest <span aria-hidden="true">&rarr;</span></Link>
                        <Link className="account-cta" to="/login">Log in or sign up</Link>
                    </div>
                </div>
                <figure className="intro-visual">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                        alt="Flag of the United States"
                    />
                    <figcaption>Resources focused on the United States</figcaption>
                </figure>
            </section>

            <section className="intro-features" aria-labelledby="features-title">
                <div className="intro-section-heading">
                    <p className="intro-eyebrow">What you can explore</p>
                    <h2 id="features-title">Start with the information you need.</h2>
                </div>
                <ul className="intro-feature-list">
                    <li>Legal information and reference resources</li>
                    <li>Guidance through common legal processes</li>
                    <li>Tools for organizing cases and appointments</li>
                    <li>AI-assisted legal information and document review</li>
                </ul>
            </section>

            <aside className="intro-notes" aria-labelledby="notes-title">
                <h2 id="notes-title">A note about using Briefcase</h2>
                <p>
                    Briefcase is not a law firm and does not provide legal representation. Its information is limited to the United States, may not cover every region, and may be incomplete or out of date. Do not rely on it as a substitute for advice from a qualified lawyer.
                </p>
            </aside>
        </main>
    );
}

export default Intro;