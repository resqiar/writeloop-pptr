import * as puppeteer from "puppeteer";

interface Props {
  id: string;
}

export default async function getPdf(
  props: Props
): Promise<ArrayBuffer | undefined> {
  if (!props.id) return;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${process.env.CLIENT_URI}/blog/${props.id}`);

  await page.emulateMediaType("screen");
  const pdf = await page.pdf({ format: "legal", printBackground: true });
  await browser.close();

  return pdf;
}
