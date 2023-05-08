import { PrismaClient } from "@prisma/client";
export const TOPICS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "Vue",
  "Angular",
  "TypeScript",
  "Bootstrap",
  "Responsive Web Design",
  "Accessibility",
  "Cross-Browser Compatibility",
  "Performance Optimization",
  "User Interface (UI) Design",
  "User Experience (UX) Design",
  "Progressive Web Apps (PWAs)",
  "Front End Frameworks",
  "Front End Libraries",
  "Front End Build Tools",
  "Version Control (e.g., Git)",
  "Front End Testing (e.g., Jest, Enzyme)",
  "Front End Security",
  "Front End Performance Monitoring",
  "Code Optimization",
  "Front End Debugging",
  "Web Accessibility Guidelines (e.g., WCAG)",
  "Single Page Applications (SPAs)",
  "Responsive Images",
  "Web Components",
  "Front End Performance Auditing",
  "Performance Metrics (e.g., Lighthouse, WebPageTest)",
  "SEO Best Practices",
  "Animation and Transitions",
  "Progressive Enhancement",
  "Feature Detection",
  "Media Queries",
  "Grid Layout",
  "Flexbox",
  "Server-Side Rendering (SSR)",
  "Client-Side Rendering (CSR)",
  "Server Push",
  "Code Splitting",
  "Lazy Loading",
  "Web Performance Optimization (WPO)",
  "Design Patterns for Front End Development",
  "Web Accessibility Evaluation Tools",
  "Front End Development Workflow",
  "Front End Design Systems",
  "Mobile-First Development",
  "Front End Performance Optimization Techniques",
];

export const INDUSTRIES = [
  "Front-end development",
  "Back-end development",
  "Full-stack development",
  "Mobile app development",
  "Web development",
  "Game development",
  "Artificial intelligence/machine learning",
  "Data science",
  "Database administration",
  "Cloud computing",
  "Cybersecurity",
  "DevOps",
  "Project management",
  "Quality assurance/testing",
  "Network administration",
  "Systems administration",
  "UI/UX design",
  "Graphic design",
  "Technical writing",
  "Content creation",
  "Digital marketing",
  "Social media management",
  "E-commerce",
  "Business intelligence",
  "Big data analytics",
  "Embedded systems",
  "Internet of things (IoT)",
  "Virtual reality (VR)",
  "Augmented reality (AR)",
  "Natural language processing (NLP)",
  "Robotics",
  "Computer vision",
  "Cloud architecture",
  "Cloud infrastructure",
  "Cloud development",
  "Cloud security",
  "Software engineering",
  "Machine learning engineering",
  "Data engineering",
  "Data analysis",
  "Data visualization",
  "Data warehousing",
  "Distributed systems",
  "High-performance computing",
  "Quantum computing",
  "Blockchain development",
  "Cryptocurrency development",
  "Game design",
  "Video production/editing",
  "Audio production/editing",
];

const topicEntries = TOPICS.map((topic) => ({
  name: topic,
  industryId: "clhfd5k680000ihizh7qm8sqq",
}));
const industryEntries = INDUSTRIES.map((industry) => ({ name: industry }));

const prisma = new PrismaClient();
async function main() {
  // for (const industry of industryEntries) {
  //   await prisma.industry.create({ data: industry });
  // }
  for (const topic of topicEntries) {
    await prisma.topic.create({ data: topic });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
