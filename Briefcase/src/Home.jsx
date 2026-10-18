import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Home/Footer.jsx';
import Header from './Home/Header.jsx';
import BORcard from './Home/BORcard.jsx';
import AIcard from './Home/AIcard.jsx';
import ConstAmmend from './Home/ConstAmmendCard.jsx';
import FooterHome from './Home/FooterHome.jsx';
import { useAuth } from './AuthContext';
import DocuHelp from './Home/DocuHelp.jsx';

function App() {
    const { isLoggedIn } = useAuth(); 
    // State hook tracking whether the popup modal overlay is active
    const [showDocuHelp, setShowDocuHelp] = useState(false);

    if (isLoggedIn === true) {
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
                            
                            {/* Clickable Card Trigger Button configured to match other toolkit cards */}
                            <div 
                                onClick={() => setShowDocuHelp(true)}
                                className="home-resource-card"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "12px" }}>✨</div>
                                <h3 style={{ fontSize: "18px", margin: "0 0 8px 0", fontWeight: "600" }}>Document Simplifier</h3>
                                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                                    Upload heavy legal documents or PDFs to get plain English translations.
                                </p>
                            </div>
                        </div>
                    </section>

                    <aside className="home-disclaimer" aria-label="Legal information notice">
                        <span className="home-disclaimer-mark" aria-hidden="true">i</span>
                        <p><strong>Information, not legal advice.</strong> Briefcase Pocket Lawyer is an educational resource, not a law firm or substitute for advice from a qualified attorney.</p>
                        <Link to="/about">About Briefcase <span aria-hidden="true">&rarr;</span></Link>
                    </aside>
                </main>
                <FooterHome />

                {/* MODAL LIGHTBOX OVERLAY WRAPPER */}
                {showDocuHelp && (
                    <div 
                        onClick={() => setShowDocuHelp(false)} // Clicking backdrop dims closes modal
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                            padding: "20px"
                        }}
                    >
                        {/* Interactive Modal Dashboard Body container */}
                        <div 
                            onClick={(e) => e.stopPropagation()} // Prevents inner element clicks from triggering parent backdrop close
                            style={{
                                backgroundColor: "#ffffff",
                                width: "100%",
                                maxWidth: "900px",
                                maxHeight: "90vh",
                                borderRadius: "16px",
                                overflowY: "auto",
                                padding: "30px",
                                position: "relative",
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            }}
                        >
                            {/* Close Trigger Button Header Element */}
                            <button
                                type="button"
                                onClick={() => setShowDocuHelp(false)}
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "25px",
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "#9ca3af",
                                    fontWeight: "300"
                                }}
                                title="Close Window"
                            >
                                ✕
                            </button>

                            {/* Mounts your full drag-and-drop tool inside the modal framing context */}
                            <DocuHelp />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    else {
        return (
            <div className="home-page">
                <Header />
                <main className="home-main">
                    <section className="home-hero" aria-labelledby="home-title">
                        <div className="home-hero-copy">
                            <p className="home-eyebrow"><span aria-hidden="true"></span> Legal information, within reach</p>
                            <h2 id="home-title">Welcome In!<br />Find Legal Help.</h2>
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
                    <section className="home-account-actions" aria-labelledby="home-account-title">
                        <div className="home-account-copy">
                            <p className="home-eyebrow">Save your conversations</p>
                            <h2 id="home-account-title">Create an account or sign in</h2>
                            <p>Log in or sign up to keep your conversations available.</p>
                        </div>
                        <ul className="home-account-links" aria-label="Account access">
                            <li><Link className="home-account-button home-account-button-primary" to="/login">Log In</Link></li>
                            <li><Link className="home-account-button home-account-button-secondary" to="/login?mode=signup">Sign Up</Link></li>
                        </ul>
                    </section>
                </main>
                <footer className="home-guest-footer">
                    <p>&copy; Briefcase Pocket Lawyer. All rights reserved.</p>
                </footer>
            </div>
        );
    }
}

export default App;


