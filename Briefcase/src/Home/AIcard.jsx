
import { Link } from 'react-router-dom';

function AIcard(){
    return(
        <Link className="Card" to="/AI">
            <img className="card-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTho3dDm6bOx2nh0MM-S9kks2_NG4qUtl2lrrWwhWfyahstaZEjzrz7HKo&s=10" alt="AI legal assistant" />
            <br></br>
            <br></br>
            <h2>Chat with Ben</h2>
            <p>Our AI assistant can help you understand your rights and provide guidance on legal matters. </p>   
            <p>Get answers to your questions and access resources to empower you as a citizen. </p>    
        </Link>
    )
}

export default AIcard