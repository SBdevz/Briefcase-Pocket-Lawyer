import { Link } from 'react-router-dom';

function Footer () {
    return (
        <footer className="footer">
            <ul>
                <Link to="/about">About</Link>
            </ul>
            <div className="container">
                <p>&copy; Briefcase Pocket Lawyer. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer