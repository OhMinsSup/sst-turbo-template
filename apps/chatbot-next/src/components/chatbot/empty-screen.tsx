import { ArrowRight } from 'lucide-react';

import { Button } from '@template/ui/button';
import { cn } from '@template/ui/utils';

const exampleMessages = [
  {
    heading: 'Why is Nvidia growing rapidly?',
    message: 'Why is Nvidia growing rapidly?',
  },
  {
    heading: 'Is the Apple Vision Pro worth buying?',
    message: 'Is the Apple Vision Pro worth buying?',
  },
  {
    heading: 'How does the Vercel AI SDK work?',
    message: 'How does the Vercel AI SDK work?',
  },
  {
    heading: 'Tesla vs Rivian',
    message: 'Tesla vs Rivian',
  },
];
export function EmptyScreen({
  submitMessage,
  className,
}: {
  submitMessage: (message: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full transition-all', className)}>
      <div className="bg-background p-2">
        <div className="mb-4 mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={`empty-message-${index}`}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={() => {
                submitMessage(message.message);
              }}
            >
              <ArrowRight size={16} className="text-muted-foreground mr-2" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
