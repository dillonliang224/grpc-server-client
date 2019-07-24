const path = require('path')
const GRPCClient = require('./lib/grpcClient')

const client = new GRPCClient({
    url: 'localhost:8999',
    protoPath: path.join(__dirname, '../src/protos/books.proto'),
    packageName: 'booksvc',
    serviceName: 'BookService',
})

const express = require('express')
const app = express()
const port = 3000

function main() {
    app.get('/book/:id', function (req, res) {
        let bookId = req.params.id
        client.FindById({ id: bookId }, function (err, response) {
            console.log('greeting: ', err, response)
            res.send(response.book)
        })
    })

    app.get('/books', function (req, res) {
        client.FindBooks({}, function (err, response) {
            console.log('greeting: ', err, response)
            res.send(response.books)
        })
    })

    app.listen(port, () => {
        console.log('client listening on port: ', port)
    })
}

main()
