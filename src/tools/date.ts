
export function getThis(wishData: string) {
    let day = new Date();

    let today:any = {};
        today.year  = day.getFullYear();
        today.month = day.getMonth()+1;
        today.week  = day.getDay();
        today.day   = day.getDate();
        
    if(wishData === "todayFull") {
        const result = `${today.year}-${today.month}-${today.day}`;
        return result;
    } else if(wishData === "today") {
        const result = `${today.day}`;
        return result;
    } else if(wishData === "thisMonth") {
        const result = `${today.month}`;
        return result;
    } else if(wishData === "thisYear") {
        const result = `${today.year}`;
        return result;
    }
}

export function getDetails(targetDate: string) {
    let date: any = {};//detect type & init
    if(targetDate === "now" || targetDate === "today" || targetDate === undefined) {
        // args example: "now", "today", undefined
        date.full           = new Date();
    } else {
        // args type: selected date
        // args example: 2020-10-17
        // example: this.model.date("2020-11-14")); , this.model.date("2020-11-14-13-43-57"));
        let splitedDate: any = targetDate.split("-");
        let tempDate: any = {};
            // insert init value
            tempDate.full   = new Date();
            tempDate.year   = splitedDate[0];
            tempDate.month  = splitedDate[1] - 1 || tempDate.full.getMonth() + 1;
            tempDate.day    = splitedDate[2]     || tempDate.full.getDate();
            tempDate.hour   = splitedDate[3]     || tempDate.full.getHours();
            tempDate.min    = splitedDate[4]     || tempDate.full.getMinutes();
            tempDate.sec    = splitedDate[5]     || tempDate.full.getSeconds();

        date.full = new Date(tempDate.year, tempDate.month, tempDate.day, tempDate.hour, tempDate.min, tempDate.sec);
    }

    //generate split value of date & return
    date.year            = date.full.getFullYear();
    date.month           = date.full.getMonth() + 1;
    date.monthNega       = 12 - date.month;
    date.monthPad        = String(date.month).padStart(2, '0');
    date.dayWeek         = date.full.getDay();
    date.day             = date.full.getDate();
    date.dayPad          = String(date.day).padStart(2, '0');
    date.hour            = date.full.getHours();
    date.hourPad         = String(date.hour).padStart(2, '0');
    date.min             = date.full.getMinutes();
    date.minPad          = String(date.min).padStart(2, '0');
    date.sec             = date.full.getSeconds();
    date.secPad          = String(date.sec).padStart(2, '0');
    date.fullStrDay      = date.year + "-" + date.monthPad + "-" + date.dayPad;
    date.fullStrDaySlash = date.year + "/" + date.monthPad + "/" + date.dayPad;
    date.fullStrTime     = date.hourPad + ":" + date.minPad + ":" + date.secPad;
    date.monthFirst      = getMonthStartOrLast("first", date);
    date.monthLast       = getMonthStartOrLast("last", date);
    date.monthDays       = date.monthLast.day;
    date.monthDaysPad    = date.monthLast.dayPad;
    return date;
}

// get details first day or last day about month of target date
export function getMonthStartOrLast (dayFirstOrLast: any, targetDate: any) {
    let date: any = {};
    if(dayFirstOrLast === "first") {
        let target = new Date(targetDate.year, targetDate.month - 1, 1);
        date.full = target;
    } else if(dayFirstOrLast === "last") {
        let target = new Date(targetDate.year, targetDate.month, 0);
        date.full = target;
    }
        date.year            = date.full.getFullYear();
        date.month           = date.full.getMonth() + 1;
        date.monthPad        = String(date.month).padStart(2, '0');
        date.dayWeek         = date.full.getDay();
        date.day             = date.full.getDate();
        date.dayPad          = String(date.day).padStart(2, '0');
        date.hour            = date.full.getHours();
        date.hourPad         = String(date.hour).padStart(2, '0');
        date.min             = date.full.getMinutes();
        date.minPad          = String(date.min).padStart(2, '0');
        date.sec             = date.full.getSeconds();
        date.secPad          = String(date.sec).padStart(2, '0');
        date.fullStrDay      = date.year + "-" + date.monthPad + "-" + date.dayPad;
        date.fullStrDaySlash = date.year + "/" + date.monthPad + "/" + date.dayPad;
        date.fullStrTime     = date.hourPad + ":" + date.minPad + ":" + date.secPad;
    return date;
}

export function getTermDetails(startDate: any, endDate: any) {
    let dateBase: any = {};
        dateBase.start    = startDate;
        dateBase.end      = endDate;
        dateBase.monthAll = 12;

    let dateDiff: any = {};
        dateDiff.year     = dateBase.end.year - dateBase.start.year + 1;
        dateDiff.monthAll = dateBase.monthAll;
        dateDiff.month    = dateBase.end.month - dateBase.start.month + 1;

    return dateDiff;
}

export function getTermDiffDay(startDay: any, endDay: any) {
    let day: any = {};
    day.start = new Date(startDay);
    day.end = new Date(endDay);
    day.termDiff = (day.end - day.start) / 86400000;
    return day.termDiff;
}