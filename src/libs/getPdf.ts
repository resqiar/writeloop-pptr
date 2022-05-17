import * as puppeteer from "puppeteer";

interface Props {
  username: string;
  slug: string;
}

export default async function getPdf(
  props: Props
): Promise<{ raw: ArrayBuffer; filename: string | undefined } | undefined> {
  if (!props.username || !props.slug) return;

  const browser = await puppeteer.launch({
    headless: true,
    // args: ["--no-sandbox"],
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

  // get title from the blog
  const title = (await getTitle(page)) as string | undefined;

  // take a snapshot and return as a pdf
  const pdf = await page.pdf({
    format: "legal",
    printBackground: true,
  });

  // close browser window
  await browser.close();

  // return raw and filename
  return { raw: pdf, filename: title };
}

async function getTitle(page: puppeteer.Page): Promise<any> {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      const extTitle = document.querySelector("#blog-title-og")?.innerHTML;
      resolve(extTitle);
    });
  });
}
