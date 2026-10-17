
import { Link } from 'react-router-dom';

function AIcard(){
    return(
        <Link className="Card" to="/AI">
            <img className="card-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTho3dDm6bOx2nh0MM-S9kks2_NG4qUtl2lrrWwhWfyahstaZEjzrz7HKo&s=10" alt="" />
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