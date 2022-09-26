import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronCommand, CronJob } from 'cron'
import { nanoid } from 'nanoid'

type JobId = string
type JobName = string

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerRegistry.name)
  private mapper = new Map<JobId, JobName>()

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /** @return Job ID */
  scheduleCron(
    callback: CronCommand,
    input: { name: string; cron: string | Date },
  ) {
    const { cron, name } = input
    const id = nanoid(9)

    const job = new CronJob(cron, callback)

    this.schedulerRegistry.addCronJob(id, job)
    this.mapper.set(id, name)

    this.logger.verbose(
      `Added Job <${name}> with id <${id}> and cron <${JSON.stringify(
        cron,
        null,
        2,
      )}>`,
    )

    job.start()
    return id
  }

  removeCron(id: string) {
    if (!this.mapper.has(id)) return false

    const job = this.schedulerRegistry.getCronJob(id)
    job.stop()

    this.schedulerRegistry.deleteCronJob(id)
    this.logger.verbose(`Removed Job with id <${id}>`)
    return true
  }
}
