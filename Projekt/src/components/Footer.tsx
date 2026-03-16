const footerStyling = {
    backgroundColor: "crimson",
    color: "white",
    padding: "2em",
    marginTop: "5em"
}

function Footer() {
    return (
        <footer style={footerStyling}>
            <p style={{marginBottom: "0.7em"}}>Bokinformation hämtas från Google Books API</p>
            <p style={{marginBottom: "0.7em"}}>Utvecklad av: Ängla Juliusson</p>
            <p>Kurs: DT210G – Fördjupad frontendutveckling</p>
        </footer>
    )
}

export default Footer;