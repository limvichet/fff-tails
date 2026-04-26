import { nextTick } from "vue"

type PrintOptions = {
  url?: string               // print page URL
  mode?: "new-tab" | "iframe"
  iframeId?: string
  waitTime?: number          // fallback delay
}

export const usePrint = () => {

  // -----------------------------
  // WAIT FOR IMAGES
  // -----------------------------
  const waitImages = async (doc: Document) => {
    const images = Array.from(doc.images)

    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise(resolve => {
          img.onload = resolve
          img.onerror = resolve
        })
      })
    )
  }

  // -----------------------------
  // WAIT FOR FONTS (important for Khmer)
  // -----------------------------
  const waitFonts = async (doc: Document) => {
    if ((doc as any).fonts?.ready) {
      await (doc as any).fonts.ready
    }
  }

  // -----------------------------
  // PRINT FROM NEW TAB
  // -----------------------------
  const printNewTab = async (url: string, waitTime = 300) => {
    const win = window.open(url, "_blank")

    if (!win) return

    const onLoad = async () => {
      try {
        await waitFonts(win.document)
        await waitImages(win.document)
        await new Promise(r => setTimeout(r, waitTime))

        win.focus()
        win.print()
      } catch (e) {
        console.error("Print error:", e)
      }
    }

    win.onload = onLoad
  }

  // -----------------------------
  // PRINT FROM IFRAME (MODAL)
  // -----------------------------
  const printIframe = async (iframeId: string, waitTime = 300) => {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement

    if (!iframe || !iframe.contentWindow) return

    const doc = iframe.contentWindow.document

    await waitFonts(doc)
    await waitImages(doc)
    await new Promise(r => setTimeout(r, waitTime))

    iframe.contentWindow.focus()
    iframe.contentWindow.print()
  }

  // -----------------------------
  // MAIN PRINT FUNCTION
  // -----------------------------
  const print = async (options: PrintOptions) => {
    const {
      url,
      mode = "new-tab",
      iframeId = "print-frame",
      waitTime = 300
    } = options

    await nextTick()

    if (mode === "new-tab" && url) {
      return printNewTab(url, waitTime)
    }

    if (mode === "iframe") {
      return printIframe(iframeId, waitTime)
    }
  }

  return {
    print,
    printNewTab,
    printIframe
  }
}