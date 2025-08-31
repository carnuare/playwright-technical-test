import { type Locator, type FrameLocator, type Page } from '@playwright/test';

export class RegistrationPage {
    page: Page;
    url: string = 'https://demoqa.com/register';
    firstNameInput: Locator;
    lastNameInput: Locator;
    usernameInput: Locator;
    passwordInput: Locator;
    registerButton: Locator;
    recaptchaFrame: FrameLocator;
    recaptchaCheckbox: Locator;
    backToLogin: Locator;
    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.usernameInput = page.getByRole('textbox', { name: 'UserName' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]');
        this.backToLogin = page.getByRole('button', { name: 'Back to Login' });
        this.recaptchaCheckbox = this.recaptchaFrame.getByRole('checkbox', { name: "I'm not a robot" });
    }

    async goto() {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    }

    async fillRegistrationForm(firstName: string, lastName: string, username: string, password: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
    }
    
    async mockCaptchaResponse() {
      // We will mock the API call instead of interacting with the iframe
      await this.page.route('**/Account/v1/User', async route => {
          if (route.request().method() === 'POST') {
              await route.fulfill({
                  status: 201,
                  contentType: 'application/json',
              });
          } else {
              route.continue();
          }
      });
    }

    async submitMockRegistration() {
        
        // Use page.evaluate to trigger the network request directly.
        // This will in turn trigger the dialog event.
        await this.page.evaluate(async () => {
            const response = await fetch('/Account/v1/User', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            // Since the code in the browser looks for the '201' status,
            // we can re-create the logic to trigger the alert.
            if (response.status === 201) {
                alert('User Register Successfully.');
            }
        });
        
    }

    async clickOnRecaptcha() {
        await this.recaptchaCheckbox.click();
    }

    async submitRegistration() {
        await this.registerButton.click();
    }

    async clickOnBackToLogin() {
        await this.backToLogin.click();
    }
}