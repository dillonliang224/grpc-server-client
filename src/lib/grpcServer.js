const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

/**
 * options
 * options.url bind url
 * options.packageName package name
 * options.serviceName service name
 * options.service service func
 * options.protoPath PROTO_PATH
 */
class GRPCServer {
    constructor(options) {
        this.options = options;
        this._server = new grpc.Server();
        this._init();
    }

    _init() {
        this._checkParam(this.options.protoPath, 'NO_PROTO_PATH')
        this._checkParam(this.options.packageName, 'NO_PACKAGE_NAME')
        this._checkParam(this.options.serviceName, 'NO_SERVICE_NAME')

        const packageDefinition = protoLoader.loadSync(this.options.protoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        const service = protoDescriptor[this.options.packageName][this.options.serviceName].service;
        this._server.addService(service, this.options.service);
    }

    _checkParam(param, msg) {
        if (!param) {
            throw new Error(msg)
        }
    }

    start() {
        this._server.bind(this.options.url, grpc.ServerCredentials.createInsecure());
        this._server.start();
        console.log(`server is listening at: ${this.options.url}`)
    }
}

module.exports = GRPCServer
