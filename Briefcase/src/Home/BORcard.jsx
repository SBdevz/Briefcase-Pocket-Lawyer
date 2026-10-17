
import { Link } from 'react-router-dom';

function BORcard(){
    return(
        <Link className="Card" to="/bill-of-rights">
            <img className="card-image" src="https://bri-wp-images.s3.amazonaws.com/wp-content/uploads/founding-fathers-550x271.png" alt="" />
            <div className="home-card-copy">
                <span className="home-card-category">YOUR RIGHTS</span>
                <h3>Bill of Rights</h3>
                <p>Explore the first ten amendments and the protections they provide.</p>
                <span className="home-card-link">Explore amendments <span aria-hidden="true">&rarr;</span></span>
            </div>
        </Link>
    )
}

export default BORcard