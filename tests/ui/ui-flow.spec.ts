import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../../pages/demoqa-register-page.ts";

test.describe("User registration and login flow in QA demo. CI Mode", () => {
  test("should register a new user (CI)", async ({ page }) => {
    // Verify the dialog message
    page.on("dialog", async (dialog) => {
      expect.soft(dialog.message()).toBe("User Register Successfully.");
      await dialog.accept();
      });

    // ---- Registration Step ----
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    
    // Bypass the captcha and API call for speed and reliability
    await registrationPage.bypassRecaptcha();
    
    // Fill the registration form
    await registrationPage.fillRegistrationForm("John", "Doe", "johndoe2512", "@Password1225");
    
    // Submit the form and expect the success alert
    await registrationPage.submitMockRegistration();

  });
});
