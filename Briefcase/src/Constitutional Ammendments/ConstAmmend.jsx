import AMaccordian from "./AmendmentAccordian";
import { Link } from "react-router-dom";
import Header from "../Home/Header.jsx";

function ConstAmmend() {
    return (
        <div className="home-page home-newspaper constitution-reference-page">
            <Header showAccountLink />
            <main className="constitution-reference-main">
                <nav className="constitution-reference-nav" aria-label="Breadcrumb">
                    <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
                    <span>United States Constitution</span>
                </nav>
                <section className="constitution-reference-intro" aria-labelledby="constitutional-amendments-title">
                    <div>
                        <p className="home-eyebrow"><span aria-hidden="true"></span> Amendments beyond the Bill of Rights</p>
                        <h1 id="constitutional-amendments-title">Constitutional Amendments</h1>
                        <p className="constitution-reference-lead">
                            Constitutional amendments are changes to the United States Constitution. They are important for understanding the evolution of American law and governance.
                        </p>
                    </div>
                    <aside className="constitution-reference-stamp" aria-label="Twenty-seven constitutional amendments">
                        <strong>27</strong>
                        <span>amendments</span>
                        <span>to date</span>
                    </aside>
                </section>
                <section className="constitution-reference-list" aria-labelledby="constitutional-amendments-list-title">
                    <div className="constitution-reference-list-heading">
                        <div>
                            <p className="home-eyebrow">The Constitution in progress</p>
                            <h2 id="constitutional-amendments-list-title">Later Amendments</h2>
                        </div>
                        <p>Plain-language summaries alongside the constitutional text.</p>
                    </div>
                    <AMaccordian />
                </section>
            </main>
            <footer className="constitution-reference-footer">
                <Link to="/Home"><span aria-hidden="true">&larr;</span> Back to Resource Toolbox</Link>
                <p>Briefcase Pocket Lawyer · Information, not legal advice</p>
            </footer>
        </div>
    )
}

export default ConstAmmend