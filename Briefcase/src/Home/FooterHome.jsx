import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function FooterHome () {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setEmail(session?.user?.email ?? '');
            }
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (isMounted) {
                setEmail(session?.user?.email ?? '');
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault(); // Stop the <Link> from jumping paths before signout completes
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            navigate('/'); 
        }
    };

    return (
        <>
        <footer className="footer">
            <ul>
                <Link to="/about">About</Link>
            </ul>
            <div>
                <ul>
                    <p>You are currently logged in as: <span className="footer-username">{email}</span></p>
                    <Link className="footer-logout" to="/" onClick={handleLogout}>Log Out</Link>
                </ul>
            </div>
            <div className="container">
                <p>&copy; Briefcase Pocket Lawyer. All rights reserved.</p>
            </div>
        </footer>
        </>
    );
}

export default FooterHome