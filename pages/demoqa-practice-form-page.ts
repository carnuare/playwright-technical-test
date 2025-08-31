import { type Locator, type Page } from "@playwright/test";

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
  constructor(page: Page) {
    this.page = page;
    this.url = DEMOQA_PRACTICE_FORM_URL;
    this.nameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.emailInput = page.getByRole("textbox", { name: "name@example.com" });
    this.mobileInput = page.getByRole("textbox", { name: "Mobile Number" });
    this.dateOfBirthInput = page.locator("#dateOfBirthInput");
    this.subjectsInput = page.locator("#subjectsInput");
    this.pictureUploadButton = page.locator('#uploadPicture');
    this.currentAddressInput = page.getByRole("textbox", { name: "Current Address"});
    this.stateDropdown = page.locator("#state");
    this.cityDropdown = page.locator("#city");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
  }

  async fillFormAndSubmit(
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
    await this.nameInput.fill(name);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.page.locator(`label[for='gender-radio-${gender}']`).click();
    await this.mobileInput.fill(mobile);
    await this.dateOfBirthInput.fill(dateOfBirth);
    // Click outside the form to hide date selector
    await this.page.getByRole("heading", { name: "Student Registration Form" }).click();

    for (const subject of subjects) {
      await this.subjectsInput.fill(subject);
      await this.page.keyboard.press('Enter');
    }
    for (const hobby of hobbies) {
        await this.page.locator(`label[for='hobbies-checkbox-${hobby}']`).click();
    }
    await this.pictureUploadButton.setInputFiles(picturePath);
    await this.currentAddressInput.fill(currentAddress);
    await this.stateDropdown.click();
    await this.page.getByText(state).nth(1).click();
    // await this.page.getByText(state).click();
    await this.cityDropdown.click();
    await this.page.getByText(city).nth(1).click();
    // await this.page.getByText(city).click();
    await this.submitButton.click();
  }

}
