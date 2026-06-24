import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto("http://localhost:3000");
    await page.waitForSelector('button[aria-label^="Switch to"]');

    const getThemeDetails = async () => {
      return await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        return {
          backgroundColor: bodyStyle.backgroundColor,
          color: bodyStyle.color,
          className: document.documentElement.className,
        };
      });
    };

    const before = await getThemeDetails();
    console.log("Before click:", before);

    await page.click('button[aria-label^="Switch to"]');
    await page.waitForTimeout(500);

    const after = await getThemeDetails();
    console.log("After click:", after);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
