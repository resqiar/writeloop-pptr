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

  await page.goto(`${process.env.CLIENT_URI}/${props.username}/${props.slug}`);

  await page.emulateMediaType("print");

  await page.evaluate(() => {
    const footer = document.querySelector("#footer-wrapper");
    if (!footer?.parentNode) return;
    footer.parentNode.removeChild(footer);
  });

  const pdf = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}
