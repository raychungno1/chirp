import { type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useUser, SignInButton } from "@clerk/nextjs";
import { type RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import LoadingSpinner, { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import PageLayout from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Pleas try again later. ");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Make a comment!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input != "") mutate({ content: input });
          }
        }}
      />
      <button
        className="flex w-12 items-center justify-center disabled:opacity-50"
        onClick={() => mutate({ content: input })}
        disabled={input === "" || isPosting}
      >
        {isPosting ? <LoadingSpinner size={20} /> : "Post"}
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = ({ post, author }: PostWithUser) => {
  const handle = `@${author.username}`;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`${handle}'s profile image`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/${handle}`}>
            <span>{handle}</span>
          </Link>
          <Link href={`/post/${post.id}`} className="flex gap-1">
            <span>·</span>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView post={post} author={author} key={post.id} />
      ))}
    </div>
  );
};
const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery(); // Start fetching data asap

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {isSignedIn ? <CreatePostWizard /> : <SignInButton />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
