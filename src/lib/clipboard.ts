type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export async function copyText(text: string, nav: Pick<Navigator, "clipboard"> = navigator): Promise<boolean> {
  try {
    if (!nav.clipboard) return false;
    await nav.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareUrl(
  url: string,
  title: string,
  nav: Partial<Pick<Navigator, "share" | "clipboard">> = navigator,
): Promise<ShareResult> {
  if (nav.share) {
    try {
      await nav.share({ url, title });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  return (await copyText(url, nav as Pick<Navigator, "clipboard">)) ? "copied" : "failed";
}
