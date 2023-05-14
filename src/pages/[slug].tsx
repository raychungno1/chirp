import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { api } from "~/utils/api";

dayjs.extend(relativeTime);

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId });
  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView post={post} author={author} key={post.id} />
      ))}
    </div>
  );
};
const SinglePostPage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({ username });
  if (!user) return <div>404</div>;
  const handle = `@${user.username}`;

  return (
    <PageLayout>
      <Head>
        <title>{user.username}</title>
      </Head>
      <div className="relative mb-16 h-36 bg-slate-600">
        <Image
          src={user.profileImageUrl}
          alt={`${handle}'s profile image`}
          width={128}
          height={128}
          className="absolute bottom-0 left-0 ml-4 translate-y-1/2 rounded-full border-4 border-black bg-black"
        />
      </div>
      <div className="border-b border-slate-400 p-4">
        <div className="text-2xl font-bold">{user.username}</div>
        <div>{handle}</div>
      </div>
      <ProfileFeed userId={user.id} />
    </PageLayout>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import PageLayout from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import PostView from "~/components/PostView";

// Prefetch user data on serverside
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("no slug");
  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
