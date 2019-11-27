/**
 * Formats a Date into yyyy/mm/dd
 * @param {Date} date The date object to format
 * @returns {String} A date string in the format "yyyy/mm/dd"
 */
const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}/${mm}/${dd}`;
}
/**
 * Grabs todays date as "yyyy/mm/dd"
 * @returns {String} Today's date string in the format "yyyy/mm/dd"
 */
const getToday = () => {
    return formatDate(new Date());
};

module.exports = {
    getToday,
    formatDate
}