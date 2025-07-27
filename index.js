import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.setViewport({
  width: 1200,
  height: 768,
});

await page.goto("https://itch.io/login");

await page.locator("[name=username]").fill(process.env.USERNAME);
await page.locator("[name=password]").fill(process.env.PASSWORD);
await page.keyboard.press("Enter");

await page.waitForNavigation({ waitUntil: "networkidle0" });

await page.goto(process.env.COLLECTION_URL);

let elementCount = await getTotalElements(),
  title = await page.$eval(".grid_header h2", (element) =>
    element.innerText.toLowerCase().split(" ").join("_")
  ),
  author = await page.$eval(".grid_header .sub_header a", (element) =>
    element.innerText.toLowerCase().split(" ").join("_")
  );

await loadAllElements();
await addToCollection();

async function getTotalElements() {
  return await page.$$eval(".game_cell", (elements) => elements.length);
}

async function loadAllElements() {
  await page.locator(".game_cell:last-child").scroll();
  await page.waitForNetworkIdle();
  const newCount = await getTotalElements();
  if (newCount > elementCount) {
    elementCount = newCount;
    return await loadAllElements();
  }
}

async function addToCollection() {
  for (let i = elementCount - 1; i <= elementCount - 1; i--) {
    const elements = await page.$$(".action_btn.add_to_collection_btn");
    const el = elements[i];
    el.click();
    await page.waitForNetworkIdle();
    const popupClass = ".add_game_to_collection_form_widget.base_widget";

    if (i === elementCount - 1) {
      // Add last item to the collection
      await page.locator(`${popupClass} input[value=new]`).click();
      await page
        .locator(`${popupClass} input[name="collection[title]"]`)
        .fill(`${title}_by_${author}`);
      await page
        .locator(`${popupClass} input[name="collection[private]"]`)
        .click();
      await page.locator(`${popupClass} .buttons .button`).click(); // TODO better selector
      await page.waitForNetworkIdle({ idleTime: 2000 });
      await page.keyboard.press("Escape");
    } else {
      // It already selects newly created collection
      await page.locator(`${popupClass} .buttons .button`).click(); // TODO better selector
      await page.waitForNetworkIdle({ idleTime: 2000 });
      await page.keyboard.press("Escape");
    }
  }
}
