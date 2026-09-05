import About from './About.jsx';

function Footer () {
    return (
        <footer className="footer">
            <ul>
                <li><link to="/About">About</link></li>
                <li><link to="/Contact">Contact</link></li>
                <li><link to="/Privacy-Policy">Privacy Policy</link></li>
                <li><link to="/Terms-of-Service">Terms of Service</link></li>
            </ul>
            <div className="container">
                <p>&copy; Briefcase Pocket Lawyer. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer