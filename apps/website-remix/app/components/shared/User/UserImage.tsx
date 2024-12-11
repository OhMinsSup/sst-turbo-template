import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@template/ui/components/avatar";

import { useUser } from "~/hooks/useUser";

interface UserImageProps {
  className?: string;
}

export function UserImage({ className }: UserImageProps) {
  const user = useUser();
  return (
    <Avatar className={className}>
      <AvatarImage src={user.UserProfile.image} alt={`@${user.username}`} />
      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
