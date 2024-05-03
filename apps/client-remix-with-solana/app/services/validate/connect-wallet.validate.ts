import { z } from 'zod';

export const schema = z.object({
  address: z.string().min(1, {
    message: '잘못된 주소 형식입니다. 주소를 확인해주세요.',
  }),
});

export type FormFieldValues = z.infer<typeof schema>;
