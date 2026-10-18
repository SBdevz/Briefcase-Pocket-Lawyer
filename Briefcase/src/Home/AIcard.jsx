
import { Link } from 'react-router-dom';

function AIcard(){
    return(
        <Link className="Card" to="/AI">
            <img className="card-image" src="https://www.bostonteapartyship.com/wp-content/uploads/2019/09/benjamin-franklin-portrait.jpg" alt="" />
            <div className="home-card-copy">
                <span className="home-card-category">AI-POWERED GUIDE</span>
                <h3>Chat with Ben</h3>
                <p>Ask questions and get help finding relevant legal information.</p>
                <span className="home-card-link">Start a conversation <span aria-hidden="true">&rarr;</span></span>
            </div>
        </Link>
    )
}

export default AIcard