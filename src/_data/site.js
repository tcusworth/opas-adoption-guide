// Global site metadata. `pathPrefix` matters for GitHub Pages:
// - User/org site (username.github.io):        PATH_PREFIX="/"
// - Project site (username.github.io/reponame): PATH_PREFIX="/reponame/"
// Set it via the PATH_PREFIX env var at build time (the GitHub Action does this).

module.exports = {
  name: "O-PAS Adoption Guide",
  tagline: "One Role at a Time",
  description:
    "An open knowledge initiative built to help the O-PAS community learn, collaborate, and innovate.",
  // Where "Ask a Question" submissions should go. Static hosting can't run
  // the original FluentForm, so this is used for the mailto fallback and can
  // be swapped for a form-service endpoint (Formspree/Getform) if preferred.
  contactEmail: "info@example.com",
  // Optional form-service endpoint (e.g. Formspree "https://formspree.io/f/xxxx"
  // or Getform). Leave empty to fall back to a mailto: submission that opens
  // the visitor's email client. See README → "Wiring up the form".
  contactFormAction: "",
  pathPrefix: process.env.PATH_PREFIX || "/",
  nav: [
    { text: "Home", url: "/" },
    { text: "About", url: "/about/" },
    { text: "FAQ", url: "/faq/" },
    { text: "Ask a Question", url: "/faq/#ask", button: true },
  ],
};
