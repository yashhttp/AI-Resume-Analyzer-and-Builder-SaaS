class ApiError extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        this.sucess = false;

        Error.captureStackTrace(this, this.constructor)
    }
}
export default ApiError;