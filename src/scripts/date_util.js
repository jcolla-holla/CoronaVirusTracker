export const getYesterdaysDate = () => {
    // if the today's date is '1'

    // create a date object using Date constructor 
    var dateObj = new Date();

    // subtract one day from current time                           
    dateObj.setDate(dateObj.getDate() - 1);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = (dateObj.getYear() + 1900).toString().slice(2, 4);
    return month + "/" + day + "/" + year;
}