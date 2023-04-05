export const ROUTES = {
  "job-board": "/job-board",
  "mock-interview": "/mock-interview",
} as const;

export const NAVIGATION = [
  {
    to: ROUTES["mock-interview"],
    text: "Mock Job Board",
  },
  {
    to: "#",
    text: "For Companies",
  },
  {
    to: "#",
    text: "About",
  },
];
