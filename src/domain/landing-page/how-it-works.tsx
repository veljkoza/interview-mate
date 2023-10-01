import { Container, Heading, Panel } from "~/components";

const singleCopy = {
  title: "uip",
  description: "uip",
};

const COPY: (typeof singleCopy)[] = [
  {
    title: "Choose Your Role",
    description:
      "Begin by selecting the role you're aiming for - be it Frontend, Backend, Mobile, or others.",
  },
  {
    title: "Pick Your Topics",
    description:
      "Depending on your chosen role, select specific areas of expertise. For instance, if you opt for Frontend, you can dive deep into React, TypeScript, and more.",
  },
  {
    title: "Set Your Experience Level",
    description:
      "Indicate your target years of experience. Whether you're a newbie or a seasoned pro aiming for 7 years or more, we've got you covered.",
  },
  {
    title: "Decide on Question Count",
    description:
      "Choose how intensive you want your mock interview to be. Opt for 10, 20, 25, or more questions to challenge yourself.",
  },
  {
    title: "Interview with AI",
    description:
      "Engage in a realistic mock interview with our state-of-the-art AI. Experience real-time questions tailored to your chosen role and expertise.",
  },
  {
    title: "Receive Instant Feedback",
    description:
      "Once you've completed the interview, get immediate, insightful feedback. Discover areas of strength and opportunities for growth.",
  },
  {
    title: "Repeat",
    description:
      "Repeat enough times until you get offer from Mark Zuckerberg himself.",
  },
];

const Card = (props: { index: number; title: string; description: string }) => {
  return (
    <div>
      <Panel className="pb-4 hover:border-accent-secondary lg:pb-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white">
          <p className="text-2xl">{props.index}</p>
        </div>
        <p className="mt-5 text-xl text-accent-secondary">{props.title}</p>
        <p className="mt-5 leading-normal text-muted-fg">{props.description}</p>
        {/* <div className="py-5"></div> */}
      </Panel>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <Container tag="section">
      <Heading className="text-center">How it works?</Heading>
      <div>
        <iframe
          width="560"
          height="315"
          className="mx-auto mt-10 block lg:mt-20"
          src="https://www.youtube.com/embed/oAeVpsdEB20?si=EN-GiaI1EVaneOyb"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      {/* <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {COPY.map((how, i) => (
          <Card
            key={i}
            index={i + 1}
            title={how.title}
            description={how.description}
          />
        ))}
      </div> */}
    </Container>
  );
};
