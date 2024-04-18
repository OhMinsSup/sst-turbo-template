import type { LucideProps } from 'lucide-react';
import {
  AlertTriangle,
  AlignLeft,
  ArrowRight,
  BookCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Component,
  CreditCard,
  File,
  FileText,
  Heart,
  HelpCircle,
  Home,
  Image,
  Laptop,
  LayoutDashboard,
  Loader2,
  Menu,
  MessageCircle,
  MessageCircleCode,
  MessageCircleMore,
  MessageSquare,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Newspaper,
  PenLine,
  PenSquare,
  PenTool,
  Pizza,
  Plus,
  PlusCircle,
  Repeat,
  Repeat2,
  RotateCcw,
  Search,
  Send,
  Settings,
  Share,
  SunMedium,
  Table,
  Trash,
  User,
  Users,
  X,
} from 'lucide-react';

export const Icons = {
  plusCircle: PlusCircle,
  repeat2: Repeat2,
  newspaper: Newspaper,
  messageCircleMore: MessageCircleMore,
  bookCheck: BookCheck,
  form: PenTool,
  penLine: PenLine,
  table: Table,
  message: MessageCircle,
  dialog: MessageCircleCode,
  dashboard: LayoutDashboard,
  component: Component,
  logo: Command,
  close: X,
  menu: Menu,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  home: Home,
  search: Search,
  pen: PenSquare,
  heart: Heart,
  alignLeft: AlignLeft,
  moreHorizontal: MoreHorizontal,
  repeat: Repeat,
  messageSquare: MessageSquare,
  rotateCcw: RotateCcw,
  users: Users,
  share: Share,
  send: Send,
  facebook: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  github: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  vercel: (props: LucideProps) => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.49998 1L6.92321 2.00307L1.17498 12L0.599976 13H1.7535H13.2464H14.4L13.825 12L8.07674 2.00307L7.49998 1ZM7.49998 3.00613L2.3285 12H12.6714L7.49998 3.00613Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export type IconType = keyof typeof Icons;
