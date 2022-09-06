exports.commissionTypes = {
    cash_in:'cash_in',
    cash_out:'cash_out',
}

exports.userTypes = {
    regular:'regular',
    govt:'govt',
}

exports.cashInCommissionFee = {
    "percents": 0.03,
    "max": {
        "amount": 5,
        "currency": "BDT"
    }
}

exports.cashOutRegularFee = {
    "percents": 0.3,
    "weekly_limit": {
        "amount": 1000,
        "currency": "BDT"
    }
}

exports.cashOutGovtFee = {
    "percents": 0.3,
    "min": {
        "amount": 0.5,
        "currency": "BDT"
    }
}