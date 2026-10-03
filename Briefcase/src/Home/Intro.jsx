//Not defined in App.jsx yet, we need to do that so this shows up.
function Intro() {
    return (
        <>  
            <button height="20px" width="100px" text="Read Me The Intro" src="Enter narration here later.">Read Me the Intro</button>
            // We need to add audio narration for intro into this button so it feels more professional.
            <button height="20px" width="100px" text="Take me to the functional shi" src="Add functiionality here later, or use a tags">Take me to the functional shi</button>
            // We need to add this button to take the user to the functional part of the app, so they can get started with their legal needs faster.
            <h3 style={{ textAlign: "center", fontSize: "24px" }}>Welcome to Briefcase Pocket Lawyer!</h3>
            <p style={{ fontSize: "21px", textAlign: "center" }}>Some info about us to get you started:</p>
            <p style={{ fontSize: "21px", textAlign: "center" }}>
                Briefcase Pocket Lawyer is a clean and efficient app designed to provide quick and reliable legal assistance on the go.
            </p>
            <a href="https://en.wikipedia.org/wiki/Flag_of_the_United_States" target="_blank" rel="noopener noreferrer">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT98_HMmkarIJrCWaaUat3g4LNazjwIPo4FMYJNGcjwRA&s=10" alt="Flag of America" style={{ maxWidth: "100%", height: "auto", textAlign: "center" }} />
            </a>
            <p style={{ fontSize: "20px", textAlign: "center" }}>
                It includes many features to help you navigate legal processes efficiently, such as:
            </p>
            <ul style={{ fontSize: "15px", textAlign: "left" }}>
                <li>Quick access to legal information and resources.</li>
                <li>Guidance through legal procedures and documentation.</li>
                <li>Tools for managing legal cases and appointments.</li>
                <li>AI-powered legal assistance and document review.</li>
            </ul>
            <p style={{ fontSize: "20px", textAlign: "center" }}>And much more!</p>
            <p style={{ fontSize: "18px", textAlign: "center" }}>
                <strong>We are committed to making legal assistance accessible and convenient for everyone, but want to do it in a safe and legal way
                so we ensure that all our services comply with legal standards and best practices.</strong>
            </p>
            <p style={{ fontSize: "20px", textAlign: "center" }}>
                <strong>Check out our services below, as we are always trying to cater to all your legal needs in a safe and efficient manner.</strong>
            </p>
            <h3 style={{ textAlign: "left" }}>Additional Notes</h3>
            <ol style={{ fontSize: "15px", textAlign: "left" }}>
                <li>We are not a law firm and do not provide legal representation.</li>
                <li>We do not cater to laws and rules that exist outside The United States of America.</li>
                <li>Some regions are not available in our app, and we cannot guarantee that our list of laws and regulations is completely valid in your specific region.</li>
                <li>We are not responsible for any legal issues that may arise from the use of our app.</li>
                <li>We cannot guarantee the accuracy or completeness of our info and if our information is up to date.</li>
            </ol>
        </>
    );
}

export default Intro