import { Link } from 'react-router-dom';
import Header from '../Home/Header.jsx';

function About() {
    return (
        <div className="home-page home-newspaper about-site">
            <Header showAccountLink />
            <main className="about-page">
                <nav className="about-nav" aria-label="Breadcrumb">
                    <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
                    <span>About Briefcase</span>
                </nav>
                <section className="about-main" aria-labelledby="about-title">
                    <div className="about-copy">
                        <p className="about-eyebrow"><span aria-hidden="true"></span> The idea behind the briefcase</p>
                        <h1 id="about-title">Legal knowledge should be easier to reach.</h1>
                        <p>
                            Briefcase is a pocket lawyer app that provides legal information and resources. Our mission is to make legal knowledge accessible to everyone, regardless of their background or experience. We believe everyone should be able to understand their legal rights and responsibilities, and we aim to provide useful information to help people navigate the legal system.
                        </p>
                    </div>
                    <aside className="about-stamp" aria-label="United States legal information resource">
                        <strong>B</strong>
                        <span>UNITED STATES</span>
                        <span>PUBLIC INFORMATION</span>
                    </aside>
                </section>
                <aside className="about-sub">
                    <strong>Information, not legal advice.</strong>
                    <p>Briefcase is not a substitute for professional legal advice. If you need help with a legal issue, consult a qualified attorney.</p>
                </aside>
                <div className="about-buts-hom">
                    <Link className="about-buts" to="/Home">
                        <span aria-hidden="true">&larr;</span> Back to Resource Toolbox
                    </Link>
                </div>
            </main>
            <footer className="about-footer">
                <p>Briefcase Pocket Lawyer · U.S. legal information and resources</p>
            </footer>
        </div>
    );
}

export default About