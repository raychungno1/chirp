import { type NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

import { api } from "~/utils/api";
import LoadingSpinner, { LoadingPage } from "~/components/loading";
import PageLayout from "~/components/layout";
import PostView from "~/components/PostView";
import { createPostSchema } from "~/schemas/post.schemas";
import ProfileImageLink from "~/components/ProfileImageLink";

dayjs.extend(relativeTime);

type FormData = z.infer<typeof createPostSchema>;
const CreatePostWizard = () => {
  const { user } = useUser();

  const { register, watch, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
  });

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
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

  const onSubmit = handleSubmit(
    (data) => mutate(data),
    (errors) => {
      const errorMessage = errors.content?.message;
      toast.error(errorMessage ?? "");
    }
  );

  if (!user || !user.username) return null;

  return (
    <div className="flex w-full gap-3">
      <ProfileImageLink
        username={user.username}
        profileImageUrl={user.profileImageUrl}
      />
      <form className="flex w-full gap-3" onSubmit={onSubmit}>
        <input
          placeholder="Make a comment!"
          className="grow bg-transparent outline-none"
          type="text"
          {...register("content")}
          disabled={isPosting}
        />
        <button
          type="submit"
          className="flex w-12 items-center justify-center disabled:opacity-50"
          disabled={watch("content") === "" || isPosting}
        >
          {isPosting ? <LoadingSpinner size={20} /> : "Post"}
        </button>
      </form>
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
        <PostView post={post} author={author} key={post.id} link />
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
