import { type Locator, type Page, expect } from "@playwright/test";

export const DEMOQA_PRACTICE_FORM_URL =
  "https://demoqa.com/automation-practice-form";

export class PracticeFormPage {
  page: Page;
  url: string;
  nameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  mobileInput: Locator;
  dateOfBirthInput: Locator;
  subjectsInput: Locator;
  pictureUploadButton: Locator;
  currentAddressInput: Locator;
  stateDropdown: Locator;
  cityDropdown: Locator;
  submitButton: Locator;
  formModal: Locator;
  constructor(page: Page) {
    this.page = page;
    this.url = DEMOQA_PRACTICE_FORM_URL;
    this.nameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.emailInput = page.getByRole("textbox", { name: "name@example.com" });
    this.mobileInput = page.getByRole("textbox", { name: "Mobile Number" });
    this.dateOfBirthInput = page.locator("#dateOfBirthInput");
    this.subjectsInput = page.locator("#subjectsInput");
    this.pictureUploadButton = page.locator("#uploadPicture");
    this.currentAddressInput = page.getByRole("textbox", {
      name: "Current Address",
    });
    this.stateDropdown = page.locator("#state");
    this.cityDropdown = page.locator("#city");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.formModal = page.locator(".modal");
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  async fillForm(
    name: string,
    lastName: string,
    email: string,
    gender: string,
    mobile: string,
    dateOfBirth: string,
    subjects: string[],
    hobbies: string[],
    picturePath: string,
    currentAddress: string,
    state: string,
    city: string 
  ) {
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await expect(this.nameInput).toHaveValue(name);

    await this.lastNameInput.fill(lastName);
    await expect(this.lastNameInput).toHaveValue(lastName);

    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);

    // radio click + assert checked
    await this.page.locator(`label[for='gender-radio-${gender}']`).click();
    await expect(this.page.locator(`#gender-radio-${gender}`)).toBeChecked();

    await this.mobileInput.fill(mobile);
    await expect(this.mobileInput).toHaveValue(mobile);

    // date input
    await this.dateOfBirthInput.fill(dateOfBirth);
    await expect(this.dateOfBirthInput).toHaveValue(dateOfBirth);

    // press escape to hide the date picker
    await this.subjectsInput.press("Escape");
    await this.page.locator(".container > div > div:nth-child(3)").click();

    // Subjects: prefer clicking the autocomplete suggestion instead of global Enter
    for (const subject of subjects) {
      await this.subjectsInput.fill(subject);

      // Wait for the suggestion list to appear and click the visible suggestion
      // Adjust the menu selector if your component uses a different class
      const suggestion = this.page
        .locator(".subjects-auto-complete__menu >> text=" + subject)
        .first();
      await suggestion.waitFor({ state: "visible" });
      await suggestion.click();
    }

    // Hobbies: click labels, ensure checked
    for (const hobby of hobbies) {
      const label = this.page.locator(`label[for='hobbies-checkbox-${hobby}']`);

      await label.click({ timeout: 2000 });
      await expect(
        this.page.locator(`#hobbies-checkbox-${hobby}`)
      ).toBeChecked();
    }

    // File upload
    await this.pictureUploadButton.setInputFiles(picturePath);

    // Address
    await this.currentAddressInput.fill(currentAddress);
    await expect(this.currentAddressInput).toHaveValue(currentAddress);

    // State dropdown: click, wait for visible option, then click it
    await this.stateDropdown.click();
    // pick the visible option (first occurrence that is visible)
    const visibleStateOption = this.page
      .getByText(state, { exact: true })
      .first();
    await visibleStateOption.waitFor({ state: "visible" });
    await visibleStateOption.click();

    // City
    await this.cityDropdown.click();
    const visibleCityOption = this.page
      .getByText(city, { exact: true })
      .first();
    await visibleCityOption.waitFor({ state: "visible" });
    await visibleCityOption.click();
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
