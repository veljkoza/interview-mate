export const ROUTES = {
  home: "/",
  "job-board": "/job-board",
  "interview-creator": "/interview-creator",
  "mock-interview": "/mock-interview",
  "my-interviews": "/my-interviews",
  "interview-results": "/interview-results",
  "interview-results/id": function (id: string) {
    return `${this["interview-results"]}/${id}`;
  },
  "my-profile": "/my-profile",
  pricing: "/pricing",
  "bundles/id": (id: string) => `/bundles/${id}`,
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
