import { UserProfile } from "@clerk/nextjs";
import { NextPage } from "next";
import { Button, Heading, PageContainer, ProgressBar } from "~/components";
import { useToggler } from "~/hooks";

const MyProfile: NextPage = () => {
  return (
    <PageContainer
      SEO={{ title: "My Profile" }}
      pageHeader={
        <PageContainer.PageHeader title={<Heading>My Profile</Heading>} />
      }
    >
      <div className="h-10"></div>
      <div className="flex items-center justify-center">
        <UserProfile />
      </div>
    </PageContainer>
  );
};

export default MyProfile;
