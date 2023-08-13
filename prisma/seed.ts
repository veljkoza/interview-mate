import { PrismaClient } from "@prisma/client";
import { TOPICS } from "./topics";

export const INDUSTRIES = [
  "Front-end development",
  "Back-end development",
  "Full-stack development",
  "Mobile app development",
  "Web development",
  "Game development",
  "Artificial intelligence/machine learning",
  "Data science",
  // "Database administration",
  // "Cloud computing",
  "Cybersecurity",
  "DevOps",
  "Project management",
  "Quality assurance/testing",
  // "Network administration",
  "Systems administration",
  "UI/UX design",
  // "Graphic design",
  "Technical writing",
  "Content creation",
  "Digital marketing",
  "Social media management",
  "E-commerce",
  "Business intelligence",
  // "Big data analytics",
  "Embedded systems",
  // "Internet of things (IoT)",
  // "Virtual reality (VR)",
  // "Augmented reality (AR)",
  // "Natural language processing (NLP)",
  // "Robotics",
  // "Computer vision",
  "Cloud architecture",
  "Cloud infrastructure",
  "Cloud development",
  // "Cloud security",
  // "Software engineering",
  // "Machine learning engineering",
  // "Data engineering",
  // "Data analysis",
  "Data visualization",
  // "Data warehousing",
  "Distributed systems",
  // "High-performance computing",
  // "Quantum computing",
  "Blockchain development",
  "Cryptocurrency development",
  // "Game design",
] as const;

// const topicEntries = TOPICS.frontendTopics.map((topic) => ({
//   name: topic,
//   industryId: "clhmau5bh0000ihwd9mnx7ztv",
// }));
// const industryEntries = INDUSTRIES.map((industry) => ({ name: industry }));

const prisma = new PrismaClient();
// async function main() {
//   for (const industry of industryEntries) {
//     await prisma.industry.create({ data: industry });
//   }
//   const frontEndSeed = await prisma.industry.findFirst({
//     where: {
//       name: "Front-end development",
//     },
//   });
//   for (const topic of topicEntries) {
//     await prisma.topic.create({
//       data: {
//         ...topic,
//         industryId: frontEndSeed?.id,
//       },
//     });
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
type TIndustryName = (typeof INDUSTRIES)[number];
const INDUSTRY_TOPIC_MAP: Record<TIndustryName, string[]> = {
  "Front-end development": TOPICS.frontendTopics,
  "Back-end development": TOPICS.backendTopics,
  "Full-stack development": TOPICS.fullStackTopics,
  "Mobile app development": TOPICS.mobileAppTopics,
  "Web development": TOPICS.webDevelopmentTopics,
  "Game development": TOPICS.gameDevelopmentTopics,
  "Artificial intelligence/machine learning": TOPICS.aiMlTopics,
  "Data science": TOPICS.dataScienceTopics,
  Cybersecurity: TOPICS.cybersecurityTopics,
  DevOps: TOPICS.devOpsTopics,
  "Project management": TOPICS.projectManagementTopics,
  "Quality assurance/testing": TOPICS.qaTestingTopics,
  "Systems administration": TOPICS.sysAdminTopics,
  "UI/UX design": TOPICS.uiUxDesignTopics,
  "Technical writing": TOPICS.technicalWritingTopics,
  "Content creation": TOPICS.contentCreationTopics,
  "Digital marketing": TOPICS.digitalMarketingTopics,
  "Social media management": TOPICS.socialMediaManagementTopics,
  "E-commerce": TOPICS.ecommerceTopics,
  "Business intelligence": TOPICS.businessIntelligenceTopics,
  "Embedded systems": TOPICS.embeddedSystemsTopics,
  "Cloud architecture": TOPICS.cloudArchitectureTopics,
  "Cloud infrastructure": TOPICS.cloudInfrastructureTopics,
  "Cloud development": TOPICS.cloudDevelopmentTopics,
  "Data visualization": TOPICS.dataVisualizationTopics,
  "Distributed systems": TOPICS.distributedSystemsTopics,
  "Blockchain development": TOPICS.blockchainDevelopmentTopics,
  "Cryptocurrency development": TOPICS.cryptocurrencyDevelopmentTopics,
};

async function seed() {
  for (const industryName of INDUSTRIES) {
    // Create an industry
    const industry = await prisma.industry.create({
      data: {
        name: industryName,
      },
    });

    // Get topics associated with the industry from the mapping
    const topicsToAssociate = INDUSTRY_TOPIC_MAP[industryName] || [];

    // Create topics associated with the industry
    for (const topicName of topicsToAssociate) {
      await prisma.topic.create({
        data: {
          name: topicName,
          industryId: industry.id, // assuming the foreign key is named industryId
        },
      });
    }
  }

  console.log("Seeding finished");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
