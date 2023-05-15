export const ROUTES = {
  "job-board": "/job-board",
  "interview-creator": "/interview-creator",
  "mock-interview": "/mock-interview",
  "my-interviews": "/my-interviews",
} as const;

export const NAVIGATION = [
  {
    to: ROUTES["interview-creator"],
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
