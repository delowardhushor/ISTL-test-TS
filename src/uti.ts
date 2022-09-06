
import moment from "moment";

export function Weekdays(){

    return moment.weekdays()

}

export function dateBetweenTwoDate(startDate : any, endDate: any){

    const now = startDate.clone(), dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }

    return dates;

};
