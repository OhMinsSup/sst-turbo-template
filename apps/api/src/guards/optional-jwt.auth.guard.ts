import { SetMetadata } from "@nestjs/common";

export const OptionalJwtAuth = () => SetMetadata("un-authorized", true);
