import type { ExperimentalMessage } from 'ai';
import { OpenAI } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import {
  type createStreamableUI,
  type createStreamableValue,
  type getMutableAIState,
} from 'ai/rsc';

import { formatDate } from '@template/date';

import { BotMessage } from '~/components/shared/bot-message';
import { type AIState, type Message } from '~/services/agents/ai';
// import {
//   checkoutBookingSchema,
//   listDestinationsSchema,
//   showBoardingPassSchema,
//   showFlightsSchema,
//   showFlightStatusSchema,
//   showHotelsSchema,
//   showSeatPickerSchema,
// } from '~/services/schema/airlines';
import { nanoid } from '~/utils';

interface AirlinesParams {
  aiState: ReturnType<typeof getMutableAIState>;
  uiStream: ReturnType<typeof createStreamableUI>;
  spinnerStream: ReturnType<typeof createStreamableUI>;
  textStream: ReturnType<typeof createStreamableValue<string>>;
  messages: Message[];
}

export async function airlines({
  uiStream,
  aiState,
  spinnerStream,
  messages,
  textStream,
}: AirlinesParams) {
  const openai = new OpenAI();

  let fullResponse = '';
  let hasError = false;
  const answer = <BotMessage streamableValue={textStream.value} />;

  const result = await experimental_streamText({
    model: openai.chat('gpt-3.5-turbo'),
    system: `\
    You are a friendly assistant that helps the user with booking flights to destinations that are based on a list of books. You can you give travel recommendations based on the books, and will continue to help the user book a flight to their destination.

    The date today is ${formatDate(new Date(), 'd LLLL, yyyy')}. 
    The user's current location is San Francisco, CA, so the departure city will be San Francisco and airport will be San Francisco International Airport (SFO). The user would like to book the flight out on May 12, 2024.

    List United Airlines flights only.
    
    Here's the flow: 
      1. List holiday destinations based on a collection of books.
      2. List flights to destination.
      3. Choose a flight.
      4. Choose a seat.
      5. Choose hotel
      6. Purchase booking.
      7. Show boarding pass.
    `,
    messages: messages as unknown as ExperimentalMessage[],
    // tools: {
    //   listDestinations: {
    //     description: 'List destination cities, max 5.',
    //     parameters: listDestinationsSchema,
    //   },
    //   showFlights: {
    //     description:
    //       "List available flights in the UI. List 3 that match user's query.",
    //     parameters: showFlightsSchema,
    //   },
    //   showSeatPicker: {
    //     description:
    //       'Show the UI to choose or change seat for the selected flight.',
    //     parameters: showSeatPickerSchema,
    //   },
    //   showHotels: {
    //     description: 'Show the UI to choose a hotel for the trip.',
    //     parameters: showHotelsSchema,
    //   },
    //   checkoutBooking: {
    //     description:
    //       'Show the UI to purchase/checkout a flight and hotel booking.',
    //     parameters: checkoutBookingSchema,
    //   },
    //   showBoardingPass: {
    //     description: "Show user's imaginary boarding pass.",
    //     parameters: showBoardingPassSchema,
    //   },
    //   showFlightStatus: {
    //     description:
    //       'Get the current status of imaginary flight by flight number and date.',
    //     parameters: showFlightStatusSchema,
    //   },
    // },
  });

  spinnerStream.done(null);

  for await (const delta of result.fullStream) {
    console.log('delta ==>', delta);
    switch (delta.type) {
      case 'text-delta': {
        if (delta.textDelta) {
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answer);
          }

          fullResponse += delta.textDelta;
          textStream.update(fullResponse);

          const oldState = aiState.get() as unknown as AIState;

          const newMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: fullResponse,
          };

          aiState.update({
            ...oldState,
            messages: [...oldState.messages, newMessage],
          });
        }
        break;
      }
      // case 'tool-call': {
      //   switch (delta.toolName) {
      //     case 'listDestinations': {
      //       break;
      //     }
      //     case 'checkoutBooking': {
      //       break;
      //     }
      //     case 'showBoardingPass': {
      //       break;
      //     }
      //     case 'showFlightStatus': {
      //       break;
      //     }
      //     case 'showFlights': {
      //       break;
      //     }
      //     case 'showHotels': {
      //       break;
      //     }
      //     case 'showSeatPicker': {
      //       break;
      //     }
      //   }
      //   break;
      // }
      case 'error': {
        hasError = true;
        fullResponse += `\nError occurred while executing the tool`;
        break;
      }
      case 'finish': {
        break;
      }
    }
  }

  return {
    fullResponse,
    hasError,
  };
}
