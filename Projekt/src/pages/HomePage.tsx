const homePageStyle = {
    maxWidth: "800px",
    margin: "60px auto",
    padding: "40px",
    textAlingn: "center",
    backgroundColor: "#f8f6f1",
    border: "1px solid #e4dfd4",
    borderRadius: "12px"
}
const textStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "15px"
}

function HomePage() {
    return (
        <main style={homePageStyle}>
            <h2 style={{fontSize: "2rem", marginBottom: "20px"}}>Välkommen till Bokhyllan</h2>
            <p style={textStyle}>
                Här kan du upptäcka nya böcker, läsa mer om dina favoriter och ta del av
                andra läsares recensioner. Sök efter en bok för att se information som
                titel, författare och beskrivning.
            </p>
            <p style={textStyle}>
                Är du inloggad kan du även skriva egna recensioner, uppdatera dem eller
                ta bort dem.
            </p>
        </main>
    )
}

export default HomePage;