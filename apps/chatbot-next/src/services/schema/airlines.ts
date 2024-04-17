import { type DeepPartial } from 'ai';
import { z } from 'zod';

export const listDestinationsSchema = z.object({
  destinations: z.array(
    z
      .string()
      .describe(
        'List of destination cities. Include rome as one of the cities.',
      ),
  ),
});

export type PartialListDestinationsSchema = DeepPartial<
  z.infer<typeof listDestinationsSchema>
>;

export const showFlightsSchema = z.object({
  departingCity: z.string(),
  arrivalCity: z.string(),
  departingAirport: z.string().describe('Departing airport code'),
  arrivalAirport: z.string().describe('Arrival airport code'),
  date: z
    .string()
    .describe("Date of the user's flight, example format: 6 April, 1998"),
});

export type PartialShowFlightsSchema = DeepPartial<
  z.infer<typeof showFlightsSchema>
>;

export const showSeatPickerSchema = z.object({
  departingCity: z.string(),
  arrivalCity: z.string(),
  flightCode: z.string(),
  date: z.string(),
});

export type PartialShowSeatPicker = DeepPartial<
  z.infer<typeof showSeatPickerSchema>
>;

export const showHotelsSchema = z.object({});

export type PartialShowHotels = DeepPartial<z.infer<typeof showHotelsSchema>>;

export const checkoutBookingSchema = z.object({});

export type PartialCheckoutBooking = DeepPartial<
  z.infer<typeof checkoutBookingSchema>
>;

export const showBoardingPassSchema = z.object({
  airline: z.string(),
  arrival: z.string(),
  departure: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  price: z.number(),
  seat: z.string(),
  date: z
    .string()
    .describe('Date of the flight, example format: 6 April, 1998'),
  gate: z.string(),
});

export type PartialShowBoardingPass = DeepPartial<
  z.infer<typeof showBoardingPassSchema>
>;

export const showFlightStatusSchema = z.object({
  flightCode: z.string(),
  date: z.string(),
  departingCity: z.string(),
  departingAirport: z.string(),
  departingAirportCode: z.string(),
  departingTime: z.string(),
  arrivalCity: z.string(),
  arrivalAirport: z.string(),
  arrivalAirportCode: z.string(),
  arrivalTime: z.string(),
});

export type PartialShowFlightStatus = DeepPartial<
  z.infer<typeof showFlightStatusSchema>
>;
