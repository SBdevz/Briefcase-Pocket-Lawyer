function ConstAmmend(){
    function handleClick() {
        window.location.href = "/constitutional-amendments";
    }
    return(
        <div className="Card" onClick={handleClick}>
            <img className="card-image" src="https://www.worldhistory.org/img/r/p/1500x1500/19151.jpg.webp?v=1769406258-1719391559" />
            <br></br>
            <br></br>
            <h2>Constitutional Amendments</h2>
            <p>Constitutional amendments are changes to the United States Constitution. </p>   
            <p>They are important for understanding the evolution of American law and governance. </p>    
        </div>
    )
}

export default ConstAmmend