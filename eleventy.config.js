module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Internal links and asset URLs are piped through Eleventy's built-in
  // `url` filter, which prepends pathPrefix automatically. That keeps the
  // site working whether it's served from the domain root or /reponame/.

  // --- Filters -------------------------------------------------------------

  // Turn a label into a slug usable as a CSS class / data attribute.
  eleventyConfig.addFilter("slugify", (str) =>
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  // Count how many FAQs carry a given role/stage label.
  eleventyConfig.addFilter("countBy", (faqs, key, value) =>
    faqs.filter((f) => (f[key] || []).includes(value)).length
  );

  // Current year, for the footer copyright.
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
