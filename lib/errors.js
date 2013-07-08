function AuthenticationError(message) {
    this.name = "AuthenticationError";
    this.message = message || "Bad user name or password";
}
AuthenticationError.prototype = new Error();
AuthenticationError.prototype.constructor = AuthenticationError;

module.exports = AuthenticationError;
