import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type RouterOutputs } from "~/utils/api";

const ProfileImageLink = ({
  username,
  profileImageUrl,
}: {
  username: string;
  profileImageUrl: string;
}) => {
  const handle = `@${username}`;

  return (
    <Link href={`/${handle}`}>
      <Image
        src={profileImageUrl}
        alt={`${handle}'s profile image`}
        className="rounded-full transition-opacity duration-200 hover:opacity-80"
        width={56}
        height={56}
      />
    </Link>
  );
};

export default ProfileImageLink;
