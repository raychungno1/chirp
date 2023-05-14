import dayjs from "dayjs";

import { type RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

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

export default PostView;
