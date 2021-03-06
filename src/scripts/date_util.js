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

export const getTwoDaysAgoDate = () => {
    // if the today's date is '1'
    // create a date object using Date constructor 
    var dateObj = new Date();

    // subtract one day from current time                           
    dateObj.setDate(dateObj.getDate() - 2);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = (dateObj.getYear() + 1900).toString().slice(2, 4);
    return month + "/" + day + "/" + year;
}

export const getYesterdaysDateDefault = () => {
    var dateObj = new Date();                           
    dateObj.setDate(dateObj.getDate() - 1);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if (month.toString().length === 1) {
        month = "0" + month;
    }

    let year = (dateObj.getYear() + 1900).toString();
    return year + "-" + month + "-" + day;
}

export const getTwoDaysAgoDateDefault = () => {
    var dateObj = new Date();                           
    dateObj.setDate(dateObj.getDate() - 2);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if (month.toString().length === 1) {
        month = "0" + month;
    }

    let year = (dateObj.getYear() + 1900).toString();
    return year + "-" + month + "-" + day;
}

export const getDate = (date = null) => {
    // note: earliest date in data: "1/22/20"

    if (date.length === 0) {
        return getYesterdaysDate();
    }

    if (date) {
        //date format: string "2020-03-10"
        let month = date.slice(5, 7);
        if (month.length === 2) {
            //account for 2 digit with one zero like "2020-03-03"
            month = month[1];
        }
        let day = date.slice(8, 10);
        if (day.length === 2 && day[0] === "0") {
            //account for 2 digit with one zero like "2020-03-03"
            day = day[1];
        }
        let year = date.slice(2, 4);
        return month + "/" + day + "/" + year;
    } else {
        getYesterdaysDate()
    }
}

export const thousands_separators = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}