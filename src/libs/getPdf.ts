import * as puppeteer from "puppeteer";

interface Props {
  username: string;
  slug: string;
}

export default async function getPdf(
  props: Props
): Promise<ArrayBuffer | undefined> {
  if (!props.username || !props.slug) return;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`${process.env.CLIENT_URI}/${props.username}/${props.slug}`, {
    waitUntil: "networkidle0",
  });

  await page.emulateMediaType("screen");

  await page.evaluate(() => {
    const hiddens = document.querySelectorAll(".hide-when-print");
    if (!hiddens) return;
    for (let index = 0; index < hiddens.length; index++) {
      hiddens[index].parentNode?.removeChild(hiddens[index]);
    }
  });

  const pdf = await page.pdf({
    format: "legal",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}
