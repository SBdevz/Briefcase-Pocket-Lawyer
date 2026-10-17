import { Link } from 'react-router-dom';

function ConstAmmend(){
    return(
        <Link className="Card" to="/constitutional-amendments">
            <img className="card-image" src="https://www.worldhistory.org/img/r/p/1500x1500/19151.jpg.webp?v=1769406258-1719391559" alt="" />
            <div className="home-card-copy">
                <span className="home-card-category">THE CONSTITUTION</span>
                <h3>Constitutional Amendments</h3>
                <p>See how the Constitution has evolved through changes over time.</p>
                <span className="home-card-link">View all amendments <span aria-hidden="true">&rarr;</span></span>
            </div>
        </Link>
    )
}

export default ConstAmmend