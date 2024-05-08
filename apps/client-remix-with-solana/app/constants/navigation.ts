import type { LucideIcon } from 'lucide-react';

import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';

export const navigation = {
  home: '/',
  login: '/login',
  register: '/register',
  connectWallet: '/register/connect-wallet',
  emailVerification: '/register/email-verification',
  user: {
    post: {
      id: (userId: string, postId: string) => `/${userId}/post/${postId}`,
    },
    id: (id: string) => `/${id}/profile`,
  },
  write: {
    root: '/write',
  },
  profile: {
    edit: '/profile/edit',
  },
  saved: '/saved',
  liked: '/liked',
  search: '/search',
  following: '/following',
  activity: {
    root: '/activity',
    follows: '/activity/follows',
    mentions: '/activity/mentions',
    replies: '/activity/replies',
    reposts: '/activity/reposts',
    verified: '/activity/verified',
  },
};

export interface NavItem {
  id:
    | 'home'
    | 'search'
    | 'thread'
    | 'activity'
    | 'myPage'
    | 'all'
    | 'follow'
    | 'replies'
    | 'mentions'
    | 'reposts';

  type: 'link' | 'myPage' | 'home' | 'thread';
  title: string;
  href?: string;
  relationHrefs?: string[];
  disabled?: boolean;
  icon: LucideIcon;
  relationIcons?: Record<string, LucideIcon>;
}

export type ScrollNavItem = Pick<NavItem, 'id' | 'type' | 'title'> & {
  href: string;
};

export const NAV_CONFIG = {
  mainNav: [
    {
      id: 'home',
      type: 'home',
      title: 'Home',
      href: navigation.home,
      icon: Icons.home,
      relationHrefs: [navigation.home, navigation.following],
      relationIcons: {
        [navigation.following]: Icons.users,
        [navigation.home]: Icons.home,
      },
    },
    {
      id: 'search',
      type: 'link',
      title: 'Search',
      href: navigation.search,
      icon: Icons.search,
    },
    {
      id: 'thread',
      type: 'thread',
      title: 'New Thread',
      href: navigation.write.root,
      icon: Icons.pen,
    },
    {
      id: 'activity',
      type: 'link',
      title: 'Activity',
      href: navigation.activity.root,
      icon: Icons.heart,
      relationHrefs: Object.values(navigation.activity),
    },
    {
      id: 'myPage',
      type: 'myPage',
      title: 'My Page',
      icon: Icons.user,
    },
  ] as NavItem[],
  scrollNav: [
    {
      id: 'all',
      type: 'like',
      title: '모두',
      href: navigation.activity.root,
    },
    {
      id: 'follow',
      type: 'link',
      title: '팔로우',
      href: navigation.activity.follows,
    },
    {
      id: 'replies',
      type: 'link',
      title: '답글',
      href: navigation.activity.replies,
    },
    {
      id: 'mentions',
      type: 'link',
      title: '언급',
      href: navigation.activity.mentions,
    },
    {
      id: 'reposts',
      type: 'link',
      title: '리포스트',
      href: navigation.activity.reposts,
    },
  ] as ScrollNavItem[],
};

interface MainNavbuttonVariantsParams {
  item: NavItem;
  type: 'footer' | 'header';
  isActive?: boolean;
  isPending?: boolean;
  isTransitioning?: boolean;
}

export const mainNavbuttonVariants = ({
  item,
  type,
  isActive,
}: MainNavbuttonVariantsParams) => {
  return cn(
    type === 'header'
      ? 'hover:bg-foreground/5 mx-[2px] my-1 flex items-center px-6 py-3 text-lg font-medium transition-colors hover:rounded-md sm:text-sm lg:px-8 lg:py-5'
      : undefined,
    type === 'footer'
      ? 'hover:bg-foreground/5 flex h-10 items-center p-4 text-lg font-medium transition-colors hover:rounded-md sm:text-sm'
      : undefined,
    isActive ? 'text-foreground' : 'text-foreground/60',
    item.disabled && 'cursor-not-allowed opacity-80',
  );
};
