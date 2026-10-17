import { Link } from 'react-router-dom';

function About() {
    return (
        <main className="about-page">
            <div className="about-main">
                <p className="about-eyebrow">Briefcase Pocket Lawyer</p>
                <h1>About</h1>
                <p>
                    Briefcase is a pocket lawyer app that provides legal information and resources. Our mission is to make legal knowledge accessible to everyone, regardless of their background or experience. We believe everyone should be able to understand their legal rights and responsibilities, and we aim to provide useful information to help people navigate the legal system.
                </p>
            </div>
            <p className="about-sub">
                Briefcase is not a substitute for professional legal advice. If you need help with a legal issue, consult a qualified attorney.
            </p>
            <div className="about-buts-hom">
                <Link className="about-buts" to="/Home">
                    <span aria-hidden="true">&larr;</span> Back to Home
                </Link>
            </div>
        </main>
    );
}

export default About