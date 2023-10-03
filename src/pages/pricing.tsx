import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import {
  AppHeader,
  BackButton,
  Button,
  Container,
  Heading,
  PageHeader,
  Separator,
} from "~/components";
import { BUNDLES, BundleType } from "~/consts/bundles";
import { ROUTES } from "~/consts/navigation";
import { Config } from "~/domain/Config";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const DISCOUNT = Config.pricing.discount;
export const getDiscountedPrice = (price: number) => {
  const discountedPrice = price - price * (DISCOUNT / 100);
  return discountedPrice.toFixed(2);
};

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const Pricing: NextPage = () => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      alert(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pricing | Interview Mate</title>
      </Head>
      <main className="fixed inset-0 flex  w-full flex-col overflow-y-auto pt-6 lg:pt-20 ">
        <AppHeader />
        <div className="items-center justify-center px-4 pb-10 pt-20 md:px-10 lg:px-24">
          <Heading
            variant="secondary"
            size={1}
            className="mt-20 w-full text-center"
          >
            Choose your bundle
          </Heading>

          <div className="mt-24 grid grid-cols-1 gap-4 gap-y-24 md:grid-cols-3 lg:mt-32 lg:grid-cols-5">
            {BUNDLES.map((bundle) => (
              <div
                key={bundle.title}
                className={`transform ${
                  bundle.highlighted ? "lg:-translate-y-11" : ""
                }`}
              >
                <article
                  className={`flex h-full transform flex-col  rounded-t-md border-2  ${
                    bundle.highlighted
                      ? "border-accent-secondary"
                      : "border-muted-default"
                  } p-6`}
                >
                  <Heading size={3}>{bundle.title}</Heading>
                  <p className="mt-5 text-muted-fg">{bundle.description}</p>
                  <p className="mt-auto text-right text-3xl text-accent-secondary">
                    {bundle.numberOfQuestions} questions
                  </p>
                  <div className="ml-auto flex gap-4">
                    <Heading
                      size={4}
                      variant="muted"
                      className="mt-5 text-right text-muted-fg line-through"
                    >
                      ${bundle.price}
                    </Heading>
                    <Heading size={3} className="mt-5 text-right ">
                      ${getDiscountedPrice(bundle.price)}
                    </Heading>
                  </div>
                </article>
                <Button
                  role="link"
                  href={ROUTES["bundles/id"](bundle.id)}
                  className="w-full text-center"
                >
                  Buy now
                </Button>
              </div>
            ))}
          </div>
          <Separator className="h-24" />
        </div>
      </main>
    </>
  );
};

export default Pricing;
