import { Form } from '@remix-run/react';

import { Button } from '@template/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@template/ui/card';

export default function EmailVerifyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이메일 확인</CardTitle>
        <CardDescription>
          이메일로 전송된 인증 링크를 클릭하여 이메일을 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form className="space-y-2" method="post">
          <Button type="submit" className="w-full">
            확인하기
          </Button>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          이메일 재전송
        </Button>
      </CardFooter>
    </Card>
  );
}
