const moment = require("moment");

/**
 * Faced an issue in this function while using ,moment.js
 * I was writing it as moment.format() and not moment().format  -->
 * I googled and read the docs and got ot know that the () paranthesis were required
 * @param {*} username
 * @param {*} text
 * @returns
 */
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm:ss a"),
  };
}

module.exports = formatMessage;
