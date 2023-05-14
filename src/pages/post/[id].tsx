import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

const SinglePostPage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "raychungno1",
  });

  if (isLoading) return <LoadingPage />;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Post View</div>
      </main>
    </>
  );
};

export default SinglePostPage;
