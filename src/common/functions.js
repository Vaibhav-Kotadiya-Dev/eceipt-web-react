import { CountryCode, NUMBERTYPE } from "./constant";
import i18n from "i18next";

export function ConvertUTCDateToLocalDate(utcTime) {
    var newDate = new Date(utcTime);
    return newDate.toLocaleString()
}

export function ConvertUTCDateToLocalSimpleDate(utcTime) {
    if (utcTime == null) return null
    var newDate = new Date(utcTime);
    const offset = newDate.getTimezoneOffset()
    newDate = new Date(newDate.getTime() - (offset * 60 * 1000))

    return newDate.toISOString().split('T')[0]
}

export function ConvertUTCDateToLocalDay(utcTime) {
    if (utcTime == null) return null
    var newDate = new Date(utcTime);
    const offset = newDate.getTimezoneOffset()
    newDate = new Date(newDate.getTime() - (offset * 60 * 1000))

    return newDate.getDate()
}

export function GetTime(timezone) {
    var d = new Date()

    switch (timezone) {
        case CountryCode.US:
            return d.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false })
        case CountryCode.SG:
            return d.toLocaleString('en-US', { timeZone: 'Asia/Singapore', hour12: false })
        default:
            return d.toLocaleString('en-US', { timeZone: 'Asia/Singapore', hour12: false })
    }
}

export function GetNumberStr(nr, type) {
    var number = null;
    if (nr === null) return nr
    try {
        number = Number(nr)
    } catch {
        return nr
    }

    switch (type) {
        case NUMBERTYPE.PCT:
            return (number * 100).toFixed(1) + '%'
        case NUMBERTYPE.B:
            return (number / 1000000000).toFixed(1).toLocaleString() + 'B'
        case NUMBERTYPE.M:
            return (number / 1000000).toFixed(1).toLocaleString() + 'M'
        case NUMBERTYPE.K:
            return (number / 1000).toFixed(1).toLocaleString() + 'K'
        case NUMBERTYPE.N1:
            return number.toFixed(1).toLocaleString()
        case NUMBERTYPE.N2:
            return number.toFixed(2).toLocaleString()
        default:
            return number
    }



}

export function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function ClearLocalData() {
    localStorage.clear();
}

export function translate(text){
    return i18n.t(text);
 }