import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PageLayout from "~/components/layout";

import generateSSGHelper from "~/utils/ssgHelper";
import { api } from "~/utils/api";
import PostView from "~/components/PostView";

dayjs.extend(relativeTime);

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ id });
  if (!data) return <div>404</div>;
  const { post, author } = data;
  const handle = `@${author.username}`;

  return (
    <PageLayout>
      <Head>
        <title>{`${post.content} - ${handle}`}</title>
      </Head>
      <PostView post={post} author={author} />
    </PageLayout>
  );
};

// Prefetch post data on serverside
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
