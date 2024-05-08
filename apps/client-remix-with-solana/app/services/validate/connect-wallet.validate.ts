import { z } from 'zod';

export const schema = z.object({
  address: z.string().min(1, {
    message: '잘못된 주소 형식입니다. 주소를 확인해주세요.',
  }),
  signature: z.string().min(1, {
    message: '잘못된 서명 형식입니다. 서명을 확인해주세요.',
  }),
  encoding: z.string().min(1, {
    message: '잘못된 인코딩 형식입니다. 인코딩을 확인해주세요.',
  }),
});

export type FormFieldValues = z.infer<typeof schema>;
