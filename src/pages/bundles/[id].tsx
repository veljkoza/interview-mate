import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsBagCheck, BsPatchCheck } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AppHeader, Button, Container, Heading } from "~/components";
import { BUNDLES, BundleType } from "~/consts/bundles";
import { ROUTES } from "~/consts/navigation";
import { useIsClient } from "~/hooks";
import { api } from "~/utils/api";

type PageProps = { id: string };

const BundlePage = () => {
  const { isClient } = useIsClient();
  const { query } = useRouter();
  const id = (query.id as string) || "";

  if (!isClient) return <div></div>;

  return <BundlePage.Content id={id} />;
};

const BundlePageContent = (props: PageProps) => {
  const { mutate: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const selectedBundle = BUNDLES.find((bundle) => bundle.id === props.id);
  const normalizeBundleForApi = (bundle: BundleType) => ({
    price: bundle.price,
    questions: bundle.numberOfQuestions,
    title: bundle.title,
    description: bundle.description,
  });

  const query = new URLSearchParams(window.location.search);
  const getPaymentStatus = () => {
    const paymentStatus = query?.get("payment-status");
    if (paymentStatus) return paymentStatus as "success" | "failed";
    return "";
  };

  const paymentStatus = getPaymentStatus();
  console.log({ selectedBundle, paymentStatus, bundleId: props.id });

  useEffect(() => {
    if (!selectedBundle) return;
    if (paymentStatus) return;
    console.log("test");
    createCheckoutSession(
      {
        items: [normalizeBundleForApi(selectedBundle)],
        originUrl: `${window.origin}/bundles/${selectedBundle.id}`,
      },
      {
        onSuccess: (redirectUrl) => {
          if (!redirectUrl) return;
          window.open(redirectUrl);
        },
      }
    );
  }, [selectedBundle, paymentStatus]);

  const renderBody = () => {
    if (!selectedBundle) return <div></div>;
    if (!paymentStatus) return <div></div>;

    if (paymentStatus === "success")
      return <BundlePage.Success bundle={selectedBundle} />;
    if (paymentStatus === "failed")
      return <BundlePage.Failed bundle={selectedBundle} />;
  };

  return (
    <main className="fixed inset-0 flex  w-full flex-col overflow-y-auto pt-6 lg:pt-20 ">
      <AppHeader />
      <Container className="h-full items-center justify-center pb-10 pt-20">
        {renderBody()}
      </Container>
    </main>
  );
};

const PaymentSuccess = ({ bundle }: { bundle: BundleType }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center  ">
      <Heading size={1}>{bundle.title}</Heading>
      <Heading className="mt-6 lg:mt-10" size={3}>
        {bundle.numberOfQuestions} questions
      </Heading>

      <BsBagCheck className="mt-10 text-[10rem] text-accent-secondary lg:mt-14" />
      <Heading size={1} className="mt-10 lg:mt-14" variant="secondary">
        Payment Successful
      </Heading>
    </div>
  );
};

const PaymentFailed = ({ bundle }: { bundle: BundleType }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center  text-accent-secondary">
      <Heading size={1}>{bundle.title}</Heading>
      <Heading className="mt-6 lg:mt-10" size={3}>
        {bundle.numberOfQuestions} questions
      </Heading>
      <IoIosCloseCircleOutline className="mt-10 text-[10rem] text-red-500 lg:mt-14" />
      <Heading
        size={1}
        className="mt-10 text-red-500 lg:mt-14"
        variant="secondary"
      >
        Payment Failed
      </Heading>
      <Button href={ROUTES["pricing"]} className="mt-10">
        Try again
      </Button>
    </div>
  );
};

BundlePage.Content = BundlePageContent;
BundlePage.Success = PaymentSuccess;
BundlePage.Failed = PaymentFailed;

export default BundlePage;
