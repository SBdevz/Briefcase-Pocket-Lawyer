import AMaccordian from "./AmendmentAccordian";
import { Link } from "react-router-dom";
import Header from "../Home/Header.jsx";

function BillOfRights() {
    return (
        <div className="home-page home-newspaper constitution-reference-page">
            <Header showAccountLink />
            <main className="constitution-reference-main">
                <nav className="constitution-reference-nav" aria-label="Breadcrumb">
                    <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
                    <span>United States Constitution</span>
                </nav>
                <section className="constitution-reference-intro" aria-labelledby="bill-rights-title">
                    <div>
                        <p className="home-eyebrow"><span aria-hidden="true"></span> The first ten amendments</p>
                        <h1 id="bill-rights-title">Bill of Rights</h1>
                        <p className="constitution-reference-lead">
                            The Bill of Rights is the first ten amendments to the United States Constitution. It guarantees fundamental rights and freedoms to all citizens, including freedom of speech, religion, and the press, the right to bear arms, protection against unreasonable searches and seizures, and the right to a fair trial.
                        </p>
                    </div>
                    <aside className="constitution-reference-stamp" aria-label="Ten amendments ratified in 1791">
                        <strong>10</strong>
                        <span>amendments</span>
                        <span>ratified in 1791</span>
                    </aside>
                </section>
                <section className="constitution-reference-list" aria-labelledby="bill-rights-list-title">
                    <div className="constitution-reference-list-heading">
                        <div>
                            <p className="home-eyebrow">A pocket reference</p>
                            <h2 id="bill-rights-list-title">The Amendments</h2>
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

export default BillOfRights