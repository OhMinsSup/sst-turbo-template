'use client';

import React from 'react';

import { ButtonScrollToBottom } from './button-scroll-to-bottom';

const exampleMessages = [
  {
    heading: 'List flights flying from',
    subheading: 'San Francisco to Rome today',
    message: `List flights flying from San Francisco to Rome today`,
  },
  {
    heading: 'What is the status',
    subheading: 'of flight BA142?',
    message: 'What is the status of flight BA142?',
  },
];

export default function ChatPanel() {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-white/90 duration-300 ease-in-out dark:from-10% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={false}
        scrollToBottom={() => {
          console.log('scrollToBottom');
        }}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid gap-2 px-4 sm:grid-cols-2 sm:gap-4 sm:px-0">
          {/* {messages.length === 0 &&
          exampleMessages.map((example, index) => (
            <div
              key={example.heading}
              className={cn(
                'cursor-pointer bg-zinc-50 text-zinc-950 rounded-2xl p-4 sm:p-6 hover:bg-zinc-100 transition-colors',
                index > 1 && 'hidden md:block'
              )}
              onClick={async () => {
                setMessages(currentMessages => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{example.message}</UserMessage>
                  }
                ])

                try {
                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                } catch {
                  toast(
                    <div className="text-red-600">
                      You have reached your message limit! Please try again
                      later, or{' '}
                      <a
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
                      >
                        deploy your own version
                      </a>
                      .
                    </div>
                  )
                }
              }}
            >
              <div className="font-medium">{example.heading}</div>
              <div className="text-sm text-zinc-800">
                {example.subheading}
              </div>
            </div>
          ))} */}
        </div>

        {/* {messages?.length >= 2 ? (
        <div className="flex h-fit items-center justify-center">
          <div className="flex space-x-2">
            {id && title ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <IconShare className="mr-2" />
                  Share
                </Button>
                <ChatShareDialog
                  open={shareDialogOpen}
                  onOpenChange={setShareDialogOpen}
                  onCopy={() => setShareDialogOpen(false)}
                  shareChat={shareChat}
                  chat={{
                    id,
                    title,
                    messages: aiState.messages
                  }}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : null} */}

        <div className="grid gap-4 sm:pb-4">
          {/* <PromptForm input={input} setInput={setInput} /> */}
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  );
}
