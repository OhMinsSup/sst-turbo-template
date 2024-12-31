import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

type Body =
  paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"];

export class SignUpDto implements Partial<Body> {
  email?: Body["email"];
  password?: Body["password"];
  username?: Body["username"];
  provider?: Body["provider"];
  __submitId?: string;
  __intent?: string;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Body & {
      submitId?: string;
      intent?: string;
    };
    this.email = body.email;
    this.password = body.password;
    this.username = body.username;
    this.provider = body.provider;
    this.__submitId = body.submitId;
    this.__intent = body.intent;
    return this;
  }

  json(): Body {
    invariant(this.email, "Email is required");
    invariant(this.password, "Password is required");
    invariant(this.provider, "Provider is required");

    return {
      email: this.email,
      password: this.password,
      username: this.username,
      provider: this.provider,
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
