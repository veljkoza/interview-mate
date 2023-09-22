import { NextPage } from "next";
import Head from "next/head";
import {
  AppHeader,
  BackButton,
  Button,
  Container,
  Heading,
  PageHeader,
  Separator,
} from "~/components";

const PRICING_OFFERS = [
  {
    title: "Rookie",
    description:
      "You are just tipping your toes into your first interviews and you want to find out how the process looks like.",
    numberOfQuestions: 50,
    price: 6.99,
  },
  {
    title: "Medior",
    description:
      "You've gone through couple of easy interviews, and maybe even started working, but now you want to spice it up.",
    numberOfQuestions: 100,
    price: 9.99,
  },
  {
    title: "Expert",
    description: "We got a real deal here. This guy interviews.",
    numberOfQuestions: 200,
    price: 15.99,
    highlighted: true,
  },
  {
    title: "Know-it-all",
    description:
      "Every master samurai needs to sharpen its blade to keep it sharp. This sentence doesn't even make sense, but this bundle is for you.",
    numberOfQuestions: 400,
    price: 20.99,
  },
];

const Pricing: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pricing | Interview Mate</title>
      </Head>
      <main className="fixed inset-0 flex  w-full flex-col overflow-y-auto pt-6 lg:pt-20 ">
        <AppHeader />
        <Container className="items-center justify-center pb-10 pt-20">
          <PageHeader
            // backButton={<BackButton />}
            title={
              <Heading
                variant="secondary"
                size={1}
                className="mt-20 w-full text-center"
              >
                Choose your bundle
              </Heading>
            }
          />

          <div className="mt-24 grid grid-cols-1 gap-4 gap-y-24 md:grid-cols-3 lg:grid-cols-4">
            {PRICING_OFFERS.map((offer) => (
              <div
                key={offer.title}
                className={`transform ${
                  offer.highlighted ? "lg:-translate-y-11" : ""
                }`}
              >
                <article
                  className={`flex h-full transform flex-col  rounded-t-md border-2  ${
                    offer.highlighted
                      ? "border-accent-secondary"
                      : "border-muted-default"
                  } p-6`}
                >
                  <Heading size={3}>{offer.title}</Heading>
                  <p className="mt-5 text-muted-fg">{offer.description}</p>
                  <Heading size={3} className="mt-auto">
                    ${offer.price}
                  </Heading>
                </article>
                <Button className="w-full">Buy now</Button>
              </div>
            ))}
          </div>
          <Separator className="h-24" />
        </Container>
      </main>
    </>
  );
};

export default Pricing;
