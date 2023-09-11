module.exports = (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id  = req.url.split("/")[3];
    const regexv4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );

    if(req.url === "/api/movies") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(req.movies));
        res.end();
    } else if(!regexv4.test(id)) {
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(JSON.stringify({title: "Validation faile", message: "UUid is invalid"}));
    } else if(baseUrl==="/api/movies/" && regexv4.test(id)) {
        res.setHeader("Content-Type", "application/json")
        let filteredMovie = req.movies.filter((movie) => {
            return movie.id === id;
        })

        if (filteredMovie.length > 0) {
            res.statusCode = 200;
            res.write(JSON.stringify(filteredMovie));
            res.end();
        } else {
            res.statusCode = 404;
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({title: "Not Found", message: "Movie not found"}))
        }
    } else {
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({title: "Not Found", message: "Route not found"}));
    }
}