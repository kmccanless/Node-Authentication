module.exports = User;

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}
