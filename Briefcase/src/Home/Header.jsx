import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Header({ showAccountLink = false, showLogout = false }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            return;
        }
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-brand">
                <h1>Briefcase Pocket Lawyer</h1>
                <h4>Your trusted legal companion on the go.</h4>
            </div>
            {showAccountLink && <Link className="header-account-link" to="/login">Log In / Sign Up</Link>}
            {showLogout && <button className="header-logout" type="button" onClick={handleLogout}>Log Out</button>}
        </header>
    );
}

export default Header