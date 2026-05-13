const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

async function scrapeAZTU(username, password) {
  const startTime = performance.now();
  const browser = await puppeteer.launch({
    headless: "new",
    // headless: false,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--single-process",
      "--no-zygote",
    ],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    await page.goto("https://sso.aztu.edu.az/", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('input[name="UserId"]');
    await page.type('input[name="UserId"]', username);
    await page.type('input[name="Password"]', password);
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    ]);

    const currentUrl = page.url();
    // console.log(currentUrl);

    if (!currentUrl.includes("Admin")) {
      return { success: false, error: "İstifadəçi adı və ya şifrə səhvdir!" };
    }
    const sidebarLink = "body > div > aside nav ul li:nth-child(1) > a";
    await page.waitForSelector(sidebarLink);
    // await page.click('button[type="submit"]');
    // await page.waitForSelector(
    //   "body > div > aside.main-sidebar.sidebar-light-primary.elevation-4 > div > nav > ul > li:nth-child(1) > a",
    // );

    const dashboardLink = await page.$eval(sidebarLink, (el) => el.href);
    // const link = await page.evaluate(
    //   () =>
    //     document.querySelector(
    //       "body > div > aside.main-sidebar.sidebar-light-primary.elevation-4 > div > nav > ul > li:nth-child(1) > a",
    //     ).href,
    // );

    await page.goto(dashboardLink, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("#menu6i > a");
    const auditoryaBtn = await page.$("#menu6i > a");
    await auditoryaBtn.click();

    await page.waitForSelector("#menu6i > ul > li:nth-child(1)");

    const lessonLinks = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll("#menu6i > ul > li > a"),
      );
      return items.map((a) => a.href);
    });
    let allData = [];
    for (const link of lessonLinks) {
      try {
        await page.goto(link, { waitUntil: "domcontentloaded" });
        const data = await getSubjectDetails(page);
        if (data) allData.push(data);
      } catch (error) {
        // console.log("Ders detayları alınamadı:", error);
      }
    }
    const endTime = performance.now();

    return {
      success: true,
      message: "Done!",
      data: allData,
      time: endTime - startTime,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return { success: false, error: "Scrape zamanı xəta baş verdi!" };
  } finally {
    await browser.close();
  }
}

async function getSubjectDetails(page) {
  try {
    await page.waitForSelector(
      "#secondary_content > div.container-fluid > div > div > div > div",
    );
    const subjectName = await page.$eval(
      "#main_content > div.content > div > div.row > div > div > h6",
      (el) => el.innerText.trim(),
    );
    let detail = {
      subjectName,
      attendance: null,
      scores: [],
    };
    await page.click(
      "#main_content > div.content > div > div.button-list.text-center > a:nth-child(7)",
    );
    await page.waitForSelector("#datatable-buttons");

    const attendance = await page.$eval(
      "#datatable-buttons > tbody:nth-child(2) > tr > td:last-child",
      (el) => el.innerText.trim(),
    );
    detail.attendance = attendance;

    await page.click(
      "#main_content > div.content > div > div.button-list.text-center > a:nth-child(6)",
    );
    await page.waitForSelector("#toplam_score");
    const td = await page.$$("#toplam_score > tbody > tr > td");
    for (let i = 0; i < td.length / 2; i++) {
      const scoreName = await td[i].evaluate((el) => el.innerText.trim());
      const score = await td[i + td.length / 2].evaluate((el) =>
        el.innerText.trim(),
      );
      detail.scores.push({ label: scoreName, value: score });
    }

    return detail;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { scrapeAZTU };
