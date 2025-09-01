import { test, expect, type Page } from "@playwright/test";
import { RegistrationPage } from "../../pages/ui-flow/demoqa-register-page.ts";
import { LoginPage, DEMOQA_LOGIN_URL } from "../../pages/ui-flow/demoqa-login-page.ts";
import { ProfilePage } from "../../pages/ui-flow/demoqa-profile-page.ts";

test.describe("User registration and login flow in QA demo.", () => {
  const isCI = !!process.env.CI;
  const randomSuffix = Math.random().toString(36).slice(2, 8);

  const userInfo = {
    firstName: "John",
    lastName: "Doe",
    username: `johndoe-${randomSuffix}`,
    password: "@Password1225",
  };

  if (isCI) {
    test("Should register a new user (CI)", async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      let hasDialogBeenHandled = false;

      // Verify the dialog message
      page.on("dialog", async (dialog) => {
        expect
          .soft(dialog.message(), "Dialog should show successful message")
          .toBe("User Register Successfully.");
        hasDialogBeenHandled = true;
        await dialog.accept();
      });
      // Registration Step
      await test.step("Go to Registration Page", async () => {
        await registrationPage.goto();
        await expect(
          page,
          "Browser should be in the correct url (register)"
        ).toHaveURL(registrationPage.url);
      });

      // Fill the registration form
      await test.step("Fill registration form", async () => {
        await registrationPage.fillRegistrationForm(
          userInfo.firstName,
          userInfo.lastName,
          userInfo.username,
          userInfo.password
        );
      });

      await test.step("Mock Recaptcha and submit form", async () => {
        // Bypass the captcha and API call
        await registrationPage.mockCaptchaResponse();

        // Submit the form and expect the success alert
        await registrationPage.submitMockRegistration();
      });

      await test.step("Login via API with the newly registered user", async () => {
        // Since we mocked the Registration submission, we will register the user via API to be able to login later
        const response = await page.request.post(
          "https://demoqa.com/Account/v1/User",
          {
            data: {
              userName: userInfo.username,
              password: userInfo.password,
            },
          }
        );
        expect(
          response.status(),
          "Status code should be successful (201 - created)"
        ).toBe(201); // Created
      });

      // Ensure the dialog was handled
      await test.step("Ensure dialog was handled", async () => {
        expect(hasDialogBeenHandled, "Dialog has appeared").toBe(true);
      });

      // Click "Back to Login" link and verify navigation
      await test.step("Navigate to Login Page", async () => {
        await registrationPage.clickOnBackToLogin();
        await expect(
          page,
          "Browser should be in the correct url (login)"
        ).toHaveURL(DEMOQA_LOGIN_URL);
      });

      await loginStep(page);
    });
  } else {
    test("Should register a new user (manual)", async ({ page }) => {
      const registrationPage = new RegistrationPage(page);
      let hasDialogBeenHandled: boolean = false;

      // Verify the dialog message
      page.on("dialog", async (dialog) => {
        expect(dialog.message(), "Dialog should show successful message").toBe(
          "User Register Successfully."
        );
        hasDialogBeenHandled = true;
        await dialog.accept();
      });

      // Registration Step
      await test.step("Go to Registration Page", async () => {
        await registrationPage.goto();
        await expect(
          page,
          "Browser should be in the correct url (register)"
        ).toHaveURL(registrationPage.url);
      });

      // Fill the registration form
      await test.step("Fill registration form", async () => {
        await registrationPage.fillRegistrationForm(
          userInfo.firstName,
          userInfo.lastName,
          userInfo.username,
          userInfo.password
        );
      });

      // Click the recaptcha checkbox
      await test.step("Solve recaptcha", async () => {
        await registrationPage.clickOnRecaptcha();
        // Solve the recaptcha manually
        console.log(
          "Please solve the recaptcha manually and then press Enter to continue..."
        );
        // await page.pause();
        await page.pause(); // Pause to allow manual interaction if needed
        await expect(
          registrationPage.recaptchaCheckbox,
          "Checkbox is ticked"
        ).toBeChecked();
      });

      await test.step("Submit registration form", async () => {
        // Submit the form and expect the success alert
        await registrationPage.submitRegistration();
      });

      // Ensure the dialog was handled
      await test.step("Ensure dialog was handled", async () => {
        await page.waitForEvent("dialog", { timeout: 5000 }); // Wait a bit to ensure dialog is handled
        expect(hasDialogBeenHandled, "Dialog has appeared").toBe(true);
      });

      // Click "Back to Login" link and verify navigation
      await test.step("Navigate to Login Page", async () => {
        await registrationPage.clickOnBackToLogin();
        await expect(
          page,
          "Browser should be in the correct url (login)"
        ).toHaveURL(DEMOQA_LOGIN_URL);
      });

      await loginStep(page);
    });
  }
  async function loginStep(page: Page) {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    // Fill the login form and submit
    await test.step("Fill login form and submit", async () => {
      await loginPage.fillLoginFormAndSubmit(
        userInfo.username,
        userInfo.password
      );
    });

    // Verify successful login by checking URL or presence of logout button
    await test.step("Verify successful login", async () => {
      await expect(page, "Browser should be in the correct url")
        .toHaveURL(profilePage.url);
      // Wait for profile page to load
      await profilePage.page.waitForLoadState("load");
    });

    // Verify key elements on the profile page
    await test.step("Verify profile page elements", async () => {
      await expect
        .soft(profilePage.userNameDisplay, "Username is OK")
        .toHaveText(userInfo.username);
      await expect
        .soft(profilePage.logOutButton, "Logout is visible")
        .toBeVisible();
      await expect
        .soft(
          profilePage.goToBookstoreButton,
          "Go to bookstore button is visible"
        )
        .toBeVisible();
      await expect
        .soft(profilePage.deleteAccountButton,
          "Delete account button is visible"
        )
        .toBeVisible();
      await expect
        .soft(profilePage.deleteAllBooksButton,
          "Detele all books button is visible"
        )
        .toBeVisible();
      await expect
        .soft(profilePage.typeToSearchInput, "Search bar is visible")
        .toBeVisible();
      await expect
        .soft(profilePage.tableRows, "Book rows are visible")
        .toBeVisible();
    });
  }
});
