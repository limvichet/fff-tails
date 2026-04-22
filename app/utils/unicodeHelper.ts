export class UnicodeHelper {

  static strleft(str: string, length: number): string {
    return str.substring(0, length)
  }

  static strright(str: string, length: number): string {
    return str.substring(str.length - length)
  }

  static strmid(str: string, start: number, count: number): string {
    try {
      return str.substring(start - 1, start - 1 + count)
    } catch {
      return str
    }
  }

  static numkh(n: number, cf: string): string {
    const cf1: Record<number, string> = {
      1: "មួយ",
      2: "ពីរ",
      3: "បី",
      4: "បួន",
      5: "ប្រាំ",
      6: "ប្រាំមួយ",
      7: "ប្រាំពីរ",
      8: "ប្រាំបី",
      9: "ប្រាំបួន",
      10: "ដប់",
      11: "ដប់មួយ",
      12: "ដប់ពីរ",
      13: "ដប់បី",
      14: "ដប់បួន",
      15: "ដប់ប្រាំ",
      16: "ដប់ប្រាំមួយ",
      17: "ដប់ប្រាំពីរ",
      18: "ដប់ប្រាំបី",
      19: "ដប់ប្រាំបួន",
    }

    const cf2: Record<number, string> = {
      2: "ម្ភៃ",
      3: "សាមសិប",
      4: "សែសិប",
      5: "ហាសិប",
      6: "ហុកសិប",
      7: "ចិតសិប",
      8: "ប៉ែតសិប",
      9: "កៅសិប",
    }

    let ftxt = ""

    if (parseInt(this.strmid(cf, 1, 1)) !== 0) {
      ftxt += cf1[parseInt(this.strmid(cf, 1, 1))] + "រយ"
    }

    if (parseInt(this.strmid(cf, 2, 1)) < 2) {
      ftxt += cf1[parseInt(this.strmid(cf, 2, 2))] || ""
    } else {
      ftxt += cf2[parseInt(this.strmid(cf, 2, 1))] || ""
      if (parseInt(this.strmid(cf, 3, 1)) !== 0) {
        ftxt += cf1[parseInt(this.strmid(cf, 3, 1))]
      }
    }

    if (n === 1) ftxt += "លាន"
    if (n === 2) ftxt += "ពាន់"

    return ftxt
  }

  static spellkhmer(numl: number = 0): string {
    let num = numl === 0 ? 0 : Math.abs(Math.floor(numl))
    let txt = ""

    let xt = this.strright(
      String(Math.floor(num / 1000000)).padStart(3, "0"),
      3
    )
    if (parseInt(xt) !== 0) {
      txt += this.numkh(1, xt)
    }

    xt = this.strright(
      String(Math.floor(num / 1000)).padStart(3, "0"),
      3
    )
    if (parseInt(xt) !== 0) {
      txt += this.numkh(2, xt)
    }

    xt = this.strright(
      String(num).padStart(3, "0"),
      3
    )
    if (parseInt(xt) !== 0) {
      txt += this.numkh(3, xt)
    }

    return txt
  }
}