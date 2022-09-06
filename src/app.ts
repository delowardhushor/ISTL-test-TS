import express from 'express'
import moment from "moment";

const InputJSON = require('./input.json')
const {cashInCommissionFee, commissionTypes, userTypes, cashOutGovtFee, cashOutRegularFee} = require('./Contants')
import {dateBetweenTwoDate}  from './uti'

const app = express()

type elm = {
    date: string,
    user_id: any,
    user_type: string,
    type: string,
    operation: { amount: number, currency: string }
}

function CalCashIn(element: elm) {
    const commission : number = element.operation.amount * cashInCommissionFee.percents / 100
    return commission > cashInCommissionFee.max.amount ? cashInCommissionFee.max.amount : commission
}

function CalGovCashOut(element: elm) {
    const commission: number = element.operation.amount * cashOutGovtFee.percents / 100
    return commission < cashOutGovtFee.min.amount ? cashOutGovtFee.min.amount : commission
}

function CalWeeklyLimit(date: string, user_id: any) {
    const weekPreViousDates = dateBetweenTwoDate(moment(date).startOf('isoWeek'), moment(date))
    let thisWeekTotalTrans: number = 0;

    for (let index = 0; index < InputJSON.length; index++) {
        if (weekPreViousDates.indexOf(InputJSON[index].date) > -1 && InputJSON[index].user_id == user_id && InputJSON[index].type == commissionTypes.cash_out) {
            thisWeekTotalTrans += parseFloat(InputJSON[index].operation.amount)
        }
    }
    return thisWeekTotalTrans
}

function CalRegCashOut(element: elm) {
    const thisWeekTrans = CalWeeklyLimit(element.date, element.user_id)
    if (thisWeekTrans <= cashOutRegularFee.weekly_limit.amount) {
        return 0
    } else {
        const transWithOutCurrentDate = thisWeekTrans - element.operation.amount
        if (transWithOutCurrentDate >= cashOutRegularFee.weekly_limit.amount) {
            return cashOutRegularFee.percents * element.operation.amount / 100
        } else {
            return (thisWeekTrans - cashOutRegularFee.weekly_limit.amount) * cashOutRegularFee.percents / 100
        }
    }
}

function CalculateTrans(data: []) {

    let result: any = []

    for (let index = 0; index < data.length; index++) {
        const element = <elm>data[index];
        if (element.type == commissionTypes.cash_in) {
            result.push(CalCashIn(element).toFixed(2))
        } else if (element.type == commissionTypes.cash_out && element.user_type == userTypes.regular) {
            result.push(CalRegCashOut(element).toFixed(2))
        } else if (element.type == commissionTypes.cash_out && element.user_type == userTypes.govt) {
            result.push(CalGovCashOut(element).toFixed(2))
        }
    }
    return result
}

const result = CalculateTrans(InputJSON)

console.log(result)

//app.listen(5000, () => console.log("server running"))