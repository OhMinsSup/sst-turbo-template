import type { LucideProps } from "@template/ui/components/icons";
import {
  AlertTriangle,
  AlignLeft,
  ArrowLeftRight,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  Eye,
  EyeOff,
  File,
  FileText,
  Heart,
  HelpCircle,
  Home,
  Image,
  Laptop,
  Loader2,
  Lock,
  MessageSquare,
  Moon,
  MoreHorizontal,
  MoreVertical,
  PenSquare,
  Pizza,
  Plus,
  Repeat,
  Repeat1,
  RotateCcw,
  Search,
  Settings,
  Share,
  SunMedium,
  Trash,
  User,
  Users,
  X,
} from "@template/ui/components/icons";

export const Icons = {
  eye: Eye,
  eyeOff: EyeOff,
  lock: Lock,
  command: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  share: Share,
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
  repeat1: Repeat1,
  messageSquare: MessageSquare,
  rotateCcw: RotateCcw,
  users: Users,
  repostCheck: ({ ...props }: LucideProps) => (
    <svg
      aria-label="리포스트"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      <title>리포스트</title>
      <path d="M16.00092,6.00098c.13013,0,.2597-.02649,.3819-.07703,.24493-.10132,.43982-.29626,.54114-.54114,.10095-.24426,.10095-.51929,0-.76367-.0509-.12305-.12451-.23401-.21729-.32642L13.20697,.79297c-.39062-.39062-1.02344-.39062-1.41406,0s-.39062,1.02344,0,1.41406l1.79395,1.79395h-5.31543c-2.90625,0-5.27148,2.36426-5.27148,5.27051v4.22852c0,.55273,.44727,1,1,1s1-.44727,1-1v-4.22852c0-1.80371,1.46777-3.27051,3.27148-3.27051h7.72949Zm3.99707,3.49609c-.55273,0-1,.44727-1,1v4.22754c0,1.80371-1.4668,3.27051-3.27051,3.27051H7.99701c-.13007,0-.2597,.02649-.38184,.0769-.24487,.10132-.43982,.29626-.54114,.54126-.10107,.24426-.10107,.51953,0,.76379,.05084,.12292,.12439,.23389,.21716,.32629l3.50171,3.50366c.19531,.19531,.45117,.29297,.70703,.29297s.51172-.09766,.70703-.29297c.39062-.39062,.39062-1.02344,0-1.41406l-1.79688-1.79785h5.31738c2.90625,0,5.27051-2.36426,5.27051-5.27051v-4.22754c0-.55273-.44727-1-1-1Zm-5.20508-.51074l-3.90527,3.90625-1.68066-1.68066c-.39062-.39062-1.02344-.39062-1.41406,0s-.39062,1.02344,0,1.41406l2.3877,2.3877c.1875,.1875,.44141,.29297,.70703,.29297s.51953-.10547,.70703-.29297l4.6123-4.61328c.39062-.39062,.39062-1.02344,0-1.41406s-1.02344-.39062-1.41406,0Z" />
    </svg>
  ),
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      />
    </svg>
  ),
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="32"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M331.5 235.7c2.2.9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6v-.5c.5-71.5 17.1-128.6 49.4-169.6c36.3-46.1 90.3-69.7 160.5-70.2h.3c70.3.5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8h-.7c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6.4 99.9 39.5 103.7 107.7l-.2.2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6.1-14.4.4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1.1z"
      />
    </svg>
  ),

  google: ({ ...props }: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  googleColor: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31.27"
      height="32"
      viewBox="0 0 256 262"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  ),
  menu: (props: LucideProps) => (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 1H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 9H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  profile: (props: LucideProps) => (
    <svg
      aria-label="Profile"
      fill="currentColor"
      height="26"
      role="img"
      viewBox="0 0 26 26"
      width="26"
      {...props}
    >
      <title>Profile</title>
      <circle cx="13" cy="7.25" r="4" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z"
        stroke="currentColor"
        strokeWidth="2.5"
      ></path>
    </svg>
  ),
  activity: (props: LucideProps) => (
    <svg
      aria-label="Notifications"
      fill="transparent"
      height="26"
      role="img"
      viewBox="0 0 26 26"
      width="26"
      {...props}
    >
      <title>Notifications</title>
      <path
        d="M2.5 9.85683C2.5 14.224 6.22178 18.5299 12.0332 22.2032C12.3554 22.397 12.7401 22.5909 13 22.5909C13.2703 22.5909 13.655 22.397 13.9668 22.2032C19.7782 18.5299 23.5 14.224 23.5 9.85683C23.5 6.11212 20.8698 3.5 17.4599 3.5C15.4847 3.5 13.9356 4.39792 13 5.74479C12.0851 4.40812 10.5257 3.5 8.5401 3.5C5.14059 3.5 2.5 6.11212 2.5 9.85683Z"
        stroke="currentColor"
        strokeWidth="2.5"
      ></path>
    </svg>
  ),
  search2: (props: LucideProps) => (
    <svg
      aria-label="Search"
      width="24"
      height="24"
      viewBox="0 0 24 25"
      fill="transparent"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Search</title>
      <path
        d="M16.5 17.725C18.0485 16.1084 19 13.9153 19 11.5C19 6.52944 14.9706 2.5 10 2.5C5.02944 2.5 1 6.52944 1 11.5C1 16.4706 5.02944 20.5 10 20.5C12.5552 20.5 14.8618 19.4351 16.5 17.725ZM16.5 17.725L22 23.225"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home2: (props: LucideProps) => (
    <svg
      aria-label="Home"
      width="24"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Home</title>
      <path
        d="M23.7633 19.3452V11.3539C23.7633 10.1542 23.2841 9.00292 22.4128 8.17828C21.3913 7.21162 19.9742 5.90754 18.8301 4.9942C16.666 3.26652 15.5859 1.85492 13.0001 1.85492C10.4142 1.85492 9.33409 3.26652 7.16997 4.9942C6.0259 5.90754 4.60877 7.21162 3.58735 8.17828C2.716 9.00292 2.23682 10.1542 2.23682 11.3539V19.3452C2.23682 20.8313 3.44153 21.6378 4.92763 21.6378H8.76391C9.3162 21.6378 9.76391 21.19 9.76391 20.6378V16.3006V15.3398C9.76391 13.5289 11.2319 12.0609 13.0428 12.0609C14.8536 12.0609 16.3216 13.5289 16.3216 15.3398V16.3006V20.6378C16.3216 21.19 16.7693 21.6378 17.3216 21.6378H21.0725C22.5586 21.6378 23.7633 20.8313 23.7633 19.3452Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  ),
  arrowLeftRight: ArrowLeftRight,
  check: Check,
};
