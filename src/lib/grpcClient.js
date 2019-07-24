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
class GRPCClient {
    constructor(options) {
        this.options = options
        let client = this._init()
        return client
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
        const service = protoDescriptor[this.options.packageName][this.options.serviceName];
        const client = new service(this.options.url, grpc.credentials.createInsecure())
        return client
    }

    _checkParam(param, msg) {
        if (!param) {
            throw new Error(msg)
        }
    }
}

module.exports = GRPCClient
