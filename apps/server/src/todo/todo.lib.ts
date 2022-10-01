import { Model } from '@beelzebub/types'

import moment from 'moment'

export class TodoLib {
  static #remindToMinute: Record<Model.RemindType, number> = {
    FIFTEEN_MINUTES_BEFORE: 15,
    FIVE_MINUTES_BEFORE: 5,
    ONE_HOUR_BEFORE: 0,
    TWELVE_HOURS_BEFORE: 0,
  }

  static #remindToHour: Record<Model.RemindType, number> = {
    FIFTEEN_MINUTES_BEFORE: 0,
    FIVE_MINUTES_BEFORE: 0,
    ONE_HOUR_BEFORE: 1,
    TWELVE_HOURS_BEFORE: 12,
  }

  public static parseToCron(input: {
    startTime: Date
    weekly: boolean
    remind: Model.RemindType
  }): string {
    const { startTime, weekly, remind } = input

    const remindTime = moment(startTime)
      .subtract(this.#remindToHour[remind], 'hour')
      .subtract(this.#remindToMinute[remind], 'minute')

    const minute = remindTime.get('minute')
    const hour = remindTime.get('hour')

    let day = '*',
      month = '*',
      weekDay = '*'

    if (weekly) {
      weekDay = remindTime.format('ddd')
    } else {
      day = remindTime.get('date') + ''
      month = remindTime.get('month') + 1 + ''
    }

    return `${minute} ${hour} ${day} ${month} ${weekDay}`
  }
}
