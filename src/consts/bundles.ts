export const BUNDLES = [
  {
    title: "Medior",
    description:
      "You've gone through couple of easy interviews, and maybe even started working, but now you want to spice it up.",
    numberOfQuestions: 500,
    price: 0.2,
    id: "price_1NtEHMJkt4yBCWfza8WP6LKM",
  },
  {
    title: "Quickie",
    description:
      "You've got interview coming up in half an hour, let's get your mind working. You got this!",
    numberOfQuestions: 10,
    price: 4.99,
    id: "price_1NtEMbJkt4yBCWfzIldsaDhcsA6",
  },
  {
    title: "Rookie",
    description:
      "You are just tipping your toes into your first interviews and you want to find out how the process looks like.",
    numberOfQuestions: 50,
    price: 19.99,
    id: "price_1NtEMbJkt4yBCWfzIlDhcsA6",
  },
  {
    title: "Medior",
    description:
      "You've gone through couple of easy interviews, and maybe even started working, but now you want to spice it up.",
    numberOfQuestions: 100,
    price: 35.99,
    id: "price_1NtEHMJkt4yBCWfza8WP6LKM",
  },
  {
    title: "Expert",
    description: "We got a real deal here. This guy interviews.",
    numberOfQuestions: 200,
    price: 69.99,
    highlighted: true,
    id: "price_1NtENJJkt4yBCWfzeqkWUF0y",
  },
  {
    title: "Know-it-all",
    description:
      "Every master samurai needs to sharpen its blade to keep it sharp. This sentence doesn't even make sense, but this bundle is for you.",
    numberOfQuestions: 400,
    price: 135.99,
    id: "price_1NtENpJkt4yBCWfzJyqDC2Hr",
  },
];

export type BundleType = (typeof BUNDLES)[0];
