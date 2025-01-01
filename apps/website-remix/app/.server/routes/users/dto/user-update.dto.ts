import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

export type Body =
  paths["/api/v1/users"]["patch"]["requestBody"]["content"]["application/json"];

export class UserUpdateDto implements Partial<Body> {
  image?: Body["image"];
  username?: Body["username"];
  firstName?: Body["firstName"];
  lastName?: Body["lastName"];
  __submitId?: string;
  __intent?: string;

  async transform(request: Request, formData?: FormData) {
    const newformData = formData ?? (await request.formData());
    const body = Object.fromEntries(newformData.entries()) as Body & {
      submitId: string;
      intent: string;
    };
    this.username = body.username;
    this.image = body.image;
    this.firstName = body.firstName;
    this.lastName = body.lastName;
    this.__submitId = body.submitId;
    this.__intent = body.intent;
    return this;
  }

  json(): Body {
    return {
      username: this.username,
      image: this.image,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  submitId(): string {
    invariant(this.__submitId, "Submit ID is required");
    return this.__submitId;
  }

  intent(): string {
    invariant(this.__intent, "Intent is required");
    return this.__intent;
  }
}
