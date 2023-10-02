import "regenerator-runtime/runtime";

import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { env } from "~/env.mjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GTM_ID = env.NEXT_PUBLIC_GTM_ID;
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      {GTM_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
          />
          <Script id="google-analytics">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GTM_ID}');
        `}
          </Script>
        </>
      )}
      <Head>
        <title>Interview Mate</title>
        <meta
          name="description"
          content="Interview Mate helps you master your interview skills with tailored mock interviews based on your experience, topic, and technologies. Perfect for both experienced professionals and beginners, get the practice you need to land your dream job."
        />
        <link rel="icon" href="/favicon.png" />
        <meta property="image" content="/seo-banner.png" />
        <meta property="og:image" content="/seo-banner.png" />

        <script async src="https://w.appzi.io/w.js?token=gmO7n"></script>
      </Head>
      <ToastContainer />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
