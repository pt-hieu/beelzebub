import { Injectable } from '@nestjs/common'
import ogs, { type OpenGraphImage } from 'open-graph-scraper'

@Injectable()
export class ScraperService {
  constructor() {}

  public async do(url: string) {
    const scrapeResult = await ogs({
      url,
      headers: {
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      },
    })

    if (!scrapeResult.result.success) return null
    const { ogImage, ...rest } = scrapeResult.result

    let typeCastedOgImage = ogImage as unknown as
      | string
      | OpenGraphImage
      | OpenGraphImage[]

    let finalOgImage: string

    if (typeof typeCastedOgImage === 'string') {
      finalOgImage = typeCastedOgImage
    } else if (Array.isArray(typeCastedOgImage)) {
      finalOgImage = typeCastedOgImage[0].url
    } else {
      finalOgImage = typeCastedOgImage.url
    }

    return { ...rest, ogImage: finalOgImage }
  }
}
