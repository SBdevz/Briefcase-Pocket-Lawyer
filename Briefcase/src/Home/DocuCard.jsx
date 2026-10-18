
import { Link } from 'react-router-dom';

function DocuCard(){
    return(
        <Link className="Card" to="/docuhelp">
            <img className="card-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzjtAcuNAizTaxAn4knZNooJHTMuG772I7P1GORmzDQ&s=10" alt="" />
            <div className="home-card-copy">
                <span className="home-card-category">YOUR RIGHTS</span>
                <h3>Document Help</h3>
                <p>Get help understanding and navigating legal documents.</p>
                <span className="home-card-link">Learn more <span aria-hidden="true">&rarr;</span></span>
            </div>
        </Link>
    )
}

export default DocuCard