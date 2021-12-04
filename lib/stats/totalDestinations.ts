import { Destination } from "@prisma/client";

export const totalDestinations = (destinations: Destination[]) => destinations.length;
