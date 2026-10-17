import { Link } from 'react-router-dom';

function ConstAmmend(){
    return(
        <Link className="Card" to="/constitutional-amendments">
            <img className="card-image" src="https://www.worldhistory.org/img/r/p/1500x1500/19151.jpg.webp?v=1769406258-1719391559" alt="Historic document representing constitutional amendments" />
            <br></br>
            <br></br>
            <h2>Constitutional Amendments</h2>
            <p>Constitutional amendments are changes to the United States Constitution. </p>   
            <p>They are important for understanding the evolution of American law and governance. </p>    
        </Link>
    )
}

export default ConstAmmend