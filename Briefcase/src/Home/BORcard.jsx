
function BORcard(){
    function handleClick() {
        window.location.href = "/bill-of-rights";
    }
    return(
        <div className="card" onClick={handleClick}>
            <img className="card-image" src="https://bri-wp-images.s3.amazonaws.com/wp-content/uploads/founding-fathers-550x271.png" alt="Bill of Rights" />
            <br></br>
            <br></br>
            <h2>Bill of Rights</h2>
            <p>The Bill of Rights is the first ten amendments to the United States Constitution. </p>   
            <p>It is important to know your rights and understand how they protect you as a citizen. </p>    
        </div>
    )
}

export default BORcard