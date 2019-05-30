const cheerio = require("cheerio");

function parseAngelList(html) {
  const $ = cheerio.load(html);
  const [title, company] = $("title")
    .text()
    .replace(" | AngelList", "")
    .split(" at ");
  const logo = $(".hero-logo-wrapper .angel_image").attr("src");
  const location = $(".high-concept")
    .eq(0)
    .text()
    .split(" · ")[0]
    .trim();
  const visa =
    $(".job-listing-metadata .s-vgBottom2")
      .eq(2)
      .text() === "Available";
  const relocation = null;
  const experience = null;
  const company_size = $(".product-metadata .u-floatLeft")
    .eq(3)
    .text();
  const technologies = $(".job-listing-metadata .s-vgBottom2")
    .eq(0)
    .text()
    .split(",")
    .map(e => e.trim());
  const compensation = $(".job-listing-metadata .s-vgBottom2")
    .eq(0)
    .text()
    .replace(/\n/g, " ");

  return {
    title,
    company,
    logo,
    location,
    visa,
    relocation,
    experience,
    company_size,
    technologies,
    compensation
  };
}

module.exports = parseAngelList;
