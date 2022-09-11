import { Readable } from 'stream'

export const readable2Buffer = (stream: Readable): Promise<Buffer> => {
  const chunks = []

  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => {
      reject(err)
    })

    stream.on('end', () => {
      return resolve(Buffer.concat(chunks))
    })
  })
}
