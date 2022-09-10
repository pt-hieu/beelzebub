import { Injectable, Logger } from '@nestjs/common'
import ogs, {
  ErrorResult,
  type OpenGraphImage,
  SuccessResult,
} from 'open-graph-scraper'

@Injectable()
export class ScraperService {
  private logger = new Logger(ScraperService.name)

  constructor() {}

  public async do(url: string) {
    const scrapeResult = await ogs({
      url,
      headers: {
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      },
    }).catch((r: ErrorResult | SuccessResult) => {
      return r
    })

    if (!scrapeResult.result.success) {
      this.logger.verbose(JSON.stringify(scrapeResult.result))

      return null
    }

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
      finalOgImage = typeCastedOgImage?.url
    }

    return { ...rest, ogImage: finalOgImage, url }
  }

  public doMany(urls: string[]) {
    return urls.map((url) => this.do(url))
  }
}
