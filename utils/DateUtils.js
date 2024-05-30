import moment from 'moment';

// Singleton class for date utility functions
// Author: Nguyen Cao Nhan
class DateUtils {
    static instance;

    constructor() {
        // Ensure that the class is a singleton
        if (DateUtils.instance) {
            return DateUtils.instance;
        }
        DateUtils.instance = this;
    }

    // Formats a date string to 'YYYY-MM-DD'
    formatDateString(dateString) {
        return moment(dateString).format('YYYY-MM-DD');
    }

    // Formats a date object or string to a specified format
    formatDate(date, format = 'DD-MM-YYYY HH:mm:ss') {
        return moment(date).format(format);
    }

    // Converts a date string to a Date object using the specified format
    convertToDate(dateString, format = 'DD-MM-YYYY HH:mm:ss') {
        return moment(dateString, format).toDate();
    }

    // Checks if a date is within a range of X minutes ago from the current time
    isInRangeXMinutesAgo(date, minutes) {
        const now = moment();
        const pastDate = moment(date).add(minutes, 'minutes');
        return pastDate.isAfter(now);
    }

    // Checks if a date is at least X seconds ago from the current time
    isAtLeastXSecondsAgo(date, seconds) {
        const now = moment();
        const pastDate = moment(date).add(seconds, 'seconds');
        return pastDate.isBefore(now);
    }

    // Gets the start of the day for a given date
    startOfDay(date) {
        return moment(date).startOf('day').toDate();
    }

    // Gets the end of the day for a given date
    endOfDay(date) {
        return moment(date).endOf('day').toDate();
    }
}

// Create a singleton instance of DateUtils and freeze it to prevent modifications
const dateUtilsInstance = new DateUtils();
Object.freeze(dateUtilsInstance);

export default dateUtilsInstance;
