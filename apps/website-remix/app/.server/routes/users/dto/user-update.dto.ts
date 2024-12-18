import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

export type Body =
  paths["/api/v1/users"]["patch"]["requestBody"]["content"]["application/json"];

export class UserUpdateDto implements Partial<Body> {
  image?: Body["image"];
  username?: Body["username"];
  __submitId?: string;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Body & {
      submitId: string;
    };
    this.username = body.username;
    this.image = body.image;
    this.__submitId = body.submitId;
    return this;
  }

  json(): Body {
    return {
      username: this.username,
      image: this.image,
    };
  }

  submitId(): string {
    invariant(this.__submitId, "Submit ID is required");
    return this.__submitId;
  }
}
