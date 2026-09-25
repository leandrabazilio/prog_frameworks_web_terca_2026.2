const ApiError = require("./ApiError");

class AlunoEmailDuplicadoError extends ApiError{

    constructor(message="Email já cadastrado", statusCode=400){

        super(message, statusCode);

    }
}

module.exports = AlunoEmailDuplicadoError;