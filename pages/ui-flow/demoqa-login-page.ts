import { type Locator, type Page } from "@playwright/test";

export const DEMOQA_LOGIN_URL = "https://demoqa.com/login";

export class LoginPage {
  page: Page;
  url: string;
  userNameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.url = DEMOQA_LOGIN_URL;
    this.userNameInput = page.getByRole("textbox", { name: "UserName" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  async fillLoginFormAndSubmit(username: string, password: string) {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
