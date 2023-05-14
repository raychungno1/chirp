import dayjs from "dayjs";

import { type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import ProfileImageLink from "./ProfileImageLink";

type PostViewProps = RouterOutputs["posts"]["getAll"][number] & {
  link?: boolean;
};
const PostView = ({ post, author, link = false }: PostViewProps) => {
  const handle = `@${author.username}`;

  const component = (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <ProfileImageLink {...author} />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/${handle}`} className="font-bold hover:underline">
            {handle}
          </Link>
          <span>·</span>
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );

  if (link) return <Link href={`/post/${post.id}`}>{component}</Link>;
  return component;
};

export default PostView;
