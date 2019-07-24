const path = require('path');
const GRPCServer = require('./lib/grpcServer')

const books = [
    { id: '1', title: 'aaaa', author: 'dillon', contentType: 'txt' },
    { id: '2', title: 'bbbb', author: 'liang', contentType: 'txt' },
];

const bookInfo = {
    id: '5c46e3fa51d14c0897003c2a',
    title: '爱丽丝漫游奇境记',
    author: '（英）卡罗尔（CarrollL.）著；黄健人译.',
    contentType: 'epub',
}

const server = new GRPCServer({
    url: 'localhost:8999',
    protoPath: path.join(__dirname, '../src/protos/books.proto'),
    packageName: 'booksvc',
    serviceName: 'BookService',
    service: {
        FindById: wrapFunc(findById),
        FindBooks: (call, callback) => {
            callback(null, { books })
        },
        SayHello: (call, callback) => {
            callback(null, { msg: call.request.name })
        }
    }
})

function findById(call) {
    let bookId = call.request.id
    // async to get book info
    return {
        book: {
            id: bookId,
            title: bookInfo.title,
            author: bookInfo.author,
            contentType: bookInfo.contentType,
        }
    }
}

function wrapFunc(fn) {
    return async function (call, callback) {
        try {
            let result = await fn(call)
            callback(null, result)
        } catch (err) {
            callback(err)
        }
    }
}

server.start()
