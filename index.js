const express = require ('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require ('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(express.json())
const games = [
    {id:1,name:"Mafia The lost heaven",price:9.99}, 
    {id:2,name:"God of War",price:49.99},
    {id:3,name:"Grand Theft Auto 5",price:29.99},
    {id:4,name:"Valorant",price:0},
    {id:5,name :"Counter Strike Global Offensive",price:13.99},
    {id: 6,name:"For Honor",price: 25},
    {id: 7,name:"Killing floor 2" ,price: 15},
    {id: 8, name: "Doom 4",price:59.99}
]

app.post('/games', (req,res) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).send({error: 'One of all params are missing'})
    }




    let game ={
        id: games.length +1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201)
        .location(`${getBaseUrl(req)}/games/${games.length}`)
        .send(game)
})
app.get('/games:id',(req,res) => {
    res.send(games[req.params.id -1])
})

app.get('/games',(req,res) => {
    res.send(games)
})
app.get('/games/:id', (req,res) => {
    if (typeof games[req.params.id - 1] === 'undefined') {
     return res.status(404).send({error: "Game not found"})
    }
    res.send(games[req.params.id - 1])
})
app.delete('/games/:id', (req,res) => {
    if (typeof games[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Game not found"})
    }
    games.splice(req.params.id -1,1)

    res.status(204).send({error: "No content"})
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
       console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted
    ? 'https' : 'http' + `://${req.headers.host}`
}