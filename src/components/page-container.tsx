import Head from "next/head";
import { PropsWithChildren, ReactNode } from "react";
import { AppHeader } from "./app-header";
import { Container } from "./containers";
import { PageHeader } from "./page-header";

interface PageContainerProps extends PropsWithChildren {
  SEO: {
    title: string;
  };
  header?: ReactNode;
  pageHeader?: ReactNode;
}

export const PageContainer = ({
  SEO,
  header = <AppHeader />,
  pageHeader,
  children,
}: PageContainerProps) => {
  return (
    <>
      <Head>
        <title>{SEO.title} | Interview Mate</title>
      </Head>
      <main className="relative pb-10">
        {header}
        <div className="relative flex flex-col pt-36">
          <Container>
            {pageHeader}
            {children}
          </Container>
        </div>
      </main>
    </>
  );
};

PageContainer.PageHeader = PageHeader;
