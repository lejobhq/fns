const cheerio = require("cheerio");

function parseStackOverflow(html) {
  const $ = cheerio.load(html);
  const [title, company] = $("title")
    .text()
    .replace("  - Stack Overflow", "")
    .split(" at ");
  const logo = $(".job-details--header .s-avatar .hmx100.wmx100").attr("src");
  const location = $(".fc-black-500").eq(0).text().replace("|", "").trim();
  const visa = !!$(".-visa").length;
  const relocation = !!$(".-relocation").length;
  const experience = $(".job-details--about")
    .children()
    .eq(0)
    .children()
    .eq(1)
    .children(".fw-bold")
    .text();
  const company_size = $(".job-details--about")
    .children()
    .eq(1)
    .children()
    .eq(1)
    .children(".fw-bold")
    .text();
  const technologies = $(".job-details__spaced .post-tag.job-link")
    .map((_, el) => $(el).text())
    .get();

  return {
    title,
    company,
    logo,
    location,
    visa,
    relocation,
    experience,
    company_size,
    technologies
  };
}

module.exports = parseStackOverflow;
