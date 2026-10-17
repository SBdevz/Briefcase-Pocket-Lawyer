import { Link } from "react-router-dom";
import Header from "../Home/Header.jsx";

function Demo() {
    return (
        <main className="demo-page">
            <div className="demo-header">
                <Header />
            </div>
            <section className="demo-content">
                <div className="demo-intro" aria-labelledby="demo-title">
                    <div>
                        <p className="demo-eyebrow">Guest preview</p>
                        <h2 id="demo-title">A practical place to begin.</h2>
                        <p className="demo-description">
                            Explore U.S. legal references and tools, all gathered in one straightforward place.
                        </p>
                    </div>
                    <div className="demo-account">
                        <Link className="account-cta" to="/login">
                            Log in or sign up
                        </Link>
                        <p className="demo-note">Save resources and get more from Briefcase.</p>
                    </div>
                </div>

                <section className="demo-resources" aria-labelledby="demo-resources-title">
                    <div className="demo-section-heading">
                        <p className="demo-eyebrow">Explore Briefcase</p>
                        <h2 id="demo-resources-title">Start with a resource.</h2>
                    </div>
                    <div className="demo-resource-list">
                        <Link className="demo-resource" to="/bill-of-rights">
                            <span className="demo-resource-number" aria-hidden="true">01</span>
                            <span className="demo-resource-copy">
                                <strong>Bill of Rights</strong>
                                <span>Read the first ten amendments and explore their meaning.</span>
                            </span>
                            <span className="demo-resource-arrow" aria-hidden="true">&rarr;</span>
                        </Link>
                        <Link className="demo-resource" to="/constitutional-amendments">
                            <span className="demo-resource-number" aria-hidden="true">02</span>
                            <span className="demo-resource-copy">
                                <strong>Constitutional amendments</strong>
                                <span>Browse amendments to the U.S. Constitution.</span>
                            </span>
                            <span className="demo-resource-arrow" aria-hidden="true">&rarr;</span>
                        </Link>
                        <Link className="demo-resource" to="/AI">
                            <span className="demo-resource-number" aria-hidden="true">03</span>
                            <span className="demo-resource-copy">
                                <strong>AI legal information</strong>
                                <span>Explore tools for finding and understanding information.</span>
                            </span>
                            <span className="demo-resource-arrow" aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </section>

                <p className="demo-disclaimer">
                    Briefcase provides general information, not legal advice or representation. For advice about your situation, speak with a qualified lawyer.
                </p>
            </section>
        </main>
    );
}

export default Demo;