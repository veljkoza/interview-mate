import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Image from "next/image";
import ctaSrc from "assets/cta_illustration.png";
import { AppHeader } from "~/components/app-header";
import { Container } from "~/components/containers";
import { Button } from "~/components/buttons";
import { Panel } from "~/components/panel";
import { ROUTES } from "~/consts/navigation";
import { HowItWorks } from "~/domain/landing-page/how-it-works";
import Head from "next/head";
import { BouncyLoader, MyModal } from "~/components";
import { useToggler } from "~/hooks";

const FEATURES = [
  {
    title: "Tailored mock interviews",
    description: `Our platform offers tailored mock interviews based on your
    experience, the topics you want to focus on, and the
    technologies you need to know. `,
  },
  {
    title: "Mock job board",
    description: `Our mock job board allows you to apply for specific roles and get feedback on your performance. Get a better understanding of what recruiters are looking for and take your interview skills to the next level.`,
  },
  {
    title: "Analytics and feedback",
    description: `Our platform provides detailed analytics on your performance, including custom feedback on your answers and correctness. With Interview Mate, you can identify your strengths and weaknesses and improve your interview skills with ease.    `,
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Interview Mate</title>
      </Head>
      <main className="relative">
        <AppHeader />
        <div className="relative flex flex-col pt-20">
          <Container
            tag="section"
            className="flex h-screen w-full grow items-center gap-4 "
          >
            <div className="lg:w-2/3">
              <h1 className="text-3xl leading-normal text-white lg:text-6xl lg:leading-snug">
                Ace your next interview
                <br />
                with{" "}
                <span className="text-accent-secondary">Interview Mate</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-fg lg:w-2/3 lg:text-xl">
                Interview Mate helps you master your interview skills with
                tailored mock interviews based on your experience, topic, and
                technologies. Perfect for both experienced professionals and
                beginners, get the practice you need to land your dream job.
              </p>
              <Button
                className="mt-14 inline-block"
                href={ROUTES["interview-creator"]}
              >
                Try it out
              </Button>
            </div>
            <Image
              src={ctaSrc}
              alt="Chat between AI and Person illustration"
              className="-mr-96 hidden w-[600px] lg:block"
            />
          </Container>
          <HowItWorks />
          {/* <Container tag="section">
            <h2 className="text-3xl leading-normal text-white lg:text-5xl">
              Features
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <div key={feature.title}>
                  <Panel className="hover:border-accent-secondary">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white">
                      <p className="text-2xl">{i + 1}</p>
                    </div>
                    <p className="mt-5 text-xl text-accent-secondary">
                      {feature.title}
                    </p>
                    <p className="mt-5 leading-normal text-muted-fg">
                      {feature.description}
                    </p>
                    <div className="py-5"></div>
                  </Panel>
                </div>
              ))}
            </div>
          </Container> */}
          <section className="">
            <Container className="flex flex-col items-center justify-center">
              <div className="mx-auto my-24 h-0.5 w-2/3 bg-accent-secondary"></div>
              <h1 className="text-center text-3xl text-white lg:text-5xl lg:leading-relaxed">
                Start mastering your interview skills today
                <br />
                with{" "}
                <span className="text-accent-secondary">Interview Mate</span>
              </h1>
              <Button
                className="mx-auto mt-14 inline-block text-center"
                href={ROUTES["interview-creator"]}
              >
                Try it out
              </Button>
            </Container>
          </section>
          <footer className="py-24 text-center text-muted-fg">
            <Container>
              Copy: © 2023 Interview Mate. All rights reserved.
            </Container>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Home;
