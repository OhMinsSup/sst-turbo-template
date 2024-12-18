import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

type Body =
  paths["/api/v1/auth/signIn"]["post"]["requestBody"]["content"]["application/json"];

export class SignInDto implements Partial<Body> {
  email?: Body["email"];
  password?: Body["password"];
  provider?: Body["provider"];

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Body;
    this.email = body.email;
    this.password = body.password;
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
      provider: this.provider,
    };
  }
}
