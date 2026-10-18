import { Link } from 'react-router-dom';

function Intro() {
    return (
        <main className="intro-page home-page home-newspaper">
            <header className="intro-topbar">
                <span className="intro-edition">A pocket guide to U.S. legal information</span>
                <Link className="intro-top-login" to="/login">Log In / Sign Up <span aria-hidden="true">&rarr;</span></Link>
            </header>

            <section className="intro-hero intro-scrapbook-hero" aria-labelledby="intro-title">
                <div className="intro-scrapbook" aria-hidden="true">
                    <figure className="intro-scrap intro-scrap-founders">
                        <img src="https://bri-wp-images.s3.amazonaws.com/wp-content/uploads/founding-fathers-550x271.png" alt="" />
                        <figcaption>FOUNDING DOCUMENTS</figcaption>
                    </figure>
                    <figure className="intro-scrap intro-scrap-constitution">
                        <img src="https://www.worldhistory.org/img/r/p/1500x1500/19151.jpg.webp?v=1769406258-1719391559" alt="" />
                        <figcaption>THE CONSTITUTION</figcaption>
                    </figure>
                    <figure className="intro-scrap intro-scrap-capitol">
                        <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/US_Capitol_east_side.JPG/960px-US_Capitol_east_side.JPG" alt="" />
                        <figcaption>CAPITOL HILL · WIKIMEDIA COMMONS</figcaption>
                    </figure>
                    <figure className="intro-scrap intro-scrap-note">
                        <span>Know your rights.<br />Know where to begin.</span>
                        <figcaption>FIELD NOTE NO. 01</figcaption>
                    </figure>
                    <span className="intro-scrap-star intro-scrap-star-one">✳</span>
                    <span className="intro-scrap-star intro-scrap-star-two">✳</span>
                    <span className="intro-scrap-star intro-scrap-star-three">✦</span>
                    <span className="intro-scrap-star intro-scrap-star-four">✦</span>
                    <span className="intro-scrap-star intro-scrap-star-five">✳</span>
                    <span className="intro-scrap-star intro-scrap-star-six">✳</span>
                </div>

                <div className="intro-copy">
                    <p className="intro-eyebrow"><span aria-hidden="true"></span> A clearer place to start</p>
                    <h1 id="intro-title">Briefcase<br />Pocket Lawyer</h1>
                    <p className="intro-lead">
                        U.S. legal information, constitutional resources, and practical tools, all in one approachable place.
                    </p>
                    <div className="intro-actions">
                        <Link className="intro-cta" to="/Home">Explore the toolkit <span aria-hidden="true">&rarr;</span></Link>
                    </div>
                    <p className="intro-subnote">Start browsing as a guest. No account needed.</p>
                </div>
            </section>

            <section className="intro-features" aria-labelledby="features-title">
                <div className="intro-section-heading">
                    <p className="intro-eyebrow"><span aria-hidden="true"></span> Inside the briefcase</p>
                    <h2 id="features-title">Start with the information you need.</h2>
                </div>
                <div className="intro-feature-content">
                    <ul className="intro-feature-list">
                        <li>Legal information and reference resources</li>
                        <li>Guidance through common legal processes</li>
                        <li>Tools for organizing cases and appointments</li>
                        <li>AI-assisted legal information and document review</li>
                    </ul>
                    <figure className="intro-features-ben">
                        <img src="/ben-neutral-cutout.png" alt="Ben, the Briefcase Pocket Lawyer legal information guide" />
                        <figcaption>Meet Ben, your pocket researcher</figcaption>
                    </figure>
                </div>
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