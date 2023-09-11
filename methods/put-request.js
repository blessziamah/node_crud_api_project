const requestBodyParser = require("../util/body-parser")
const writeToFile = require("../util/write-to-file")
module.exports = async (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id  = req.url.split("/")[3];
    const regexv4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );

    if(!regexv4.test(id)) {
        res.writeHead(400, {"Content-Type": "application/json"})
        res.end(JSON.stringify({title: "Validation faile", message: "UUid is invalid"}));
    } else if(baseUrl==="/api/movies/" && regexv4.test(id)){
        try{
            let body = await requestBodyParser(req)
            const index = req.movies.findIndex((movie) => {
                return movie.id === id;
            })
            if(index === -1) {
                res.statusCode = 404;
                res.writeHead(404, {"Content-Type": "application/json"})
                res.end(JSON.stringify({title: "Not Found", message: "Movie not found"}))
                res.end();
            } else {
                req.movies[index] = {id, ...body}
                writeToFile(req.movies)
                res.writeHead(400, {"Content-Type": "application/json"})
                res.end(JSON.stringify(req.movies[index]));
            }
        }catch(err){
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({title: "Validation failed ", message: "Request body ain't valid"}));
            console.log(err);
        }
    } else {
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({title: "Not Found", message: "Route not found"}));
    }
}