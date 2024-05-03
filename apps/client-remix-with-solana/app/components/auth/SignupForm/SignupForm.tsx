import { useLocation } from '@remix-run/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@template/ui/tabs';

import { navigation } from '~/constants/navigation';

interface SignupFormProps {
  children: React.ReactNode;
}

export default function SignupForm({ children }: SignupFormProps) {
  const location = useLocation();
  return (
    <Tabs value={location.pathname}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={navigation.register}>계정 생성</TabsTrigger>
        <TabsTrigger value={navigation.connectWallet}>지갑 연결</TabsTrigger>
        <TabsTrigger value={navigation.emailVerification}>
          이메일 확인
        </TabsTrigger>
      </TabsList>
      <TabsContent value={navigation.register}>{children}</TabsContent>
      <TabsContent value={navigation.connectWallet}>{children}</TabsContent>
      <TabsContent value={navigation.emailVerification}>{children}</TabsContent>
    </Tabs>
  );
}
