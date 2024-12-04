import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

type Body =
  paths["/api/v1/auth/signUp"]["post"]["requestBody"]["content"]["application/json"];

export class SignUpDto implements Partial<Body> {
  email?: Body["email"];
  password?: Body["password"];
  username?: Body["username"];
  provider?: Body["provider"];

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Body;
    this.email = body.email;
    this.password = body.password;
    this.username = body.username;
    this.provider = body.provider;
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
}
