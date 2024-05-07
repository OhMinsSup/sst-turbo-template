import { useLocation } from '@remix-run/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@template/ui/tabs';

import { navigation } from '~/constants/navigation';

interface SignupFormProps {
  children: React.ReactNode;
}

const navigationTabs = [
  {
    name: '계정 생성',
    value: navigation.register,
  },
  {
    name: '지갑 연결',
    value: navigation.connectWallet,
  },
  {
    name: '이메일 확인',
    value: navigation.emailVerification,
  },
];

export default function SignupForm({ children }: SignupFormProps) {
  const location = useLocation();
  return (
    <Tabs value={location.pathname}>
      <TabsList className="grid w-full grid-cols-3">
        {navigationTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {navigationTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
