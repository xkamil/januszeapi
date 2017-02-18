var Logger = {
    log: function (tag, message) {

        tag = tag || '';
        message = message || '';
        console.log(this.getCurrentDate() + '  ' + tag + '  ' + message);

    },

    getCurrentDate: function () {
        var date = new Date();

        var dateString = date.getDate() + '/'
            + date.getMonth() + '/'
            + date.getFullYear() + ' '
            + date.getHours() + ':'
            + date.getMinutes() + ':'
            + date.getSeconds();

        return dateString;
    }
};

module.exports = Logger;


