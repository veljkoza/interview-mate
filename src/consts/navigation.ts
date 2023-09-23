export const ROUTES = {
  "job-board": "/job-board",
  "interview-creator": "/interview-creator",
  "mock-interview": "/mock-interview",
  "my-interviews": "/my-interviews",
  "interview-results": "/interview-results",
  pricing: "/pricing",
} as const;

export const NAVIGATION = [
  // {
  //   to: ROUTES["interview-creator"],
  //   text: "Mock Job Board",
  // },
  // {
  //   to: "#",
  //   text: "For Companies",
  // },
  // {
  //   to: "#",
  //   text: "About",
  // },
  {
    to: ROUTES.pricing,
    text: "Pricing",
  },
];
