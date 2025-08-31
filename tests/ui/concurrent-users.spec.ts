import { test, expect } from "@playwright/test";
import { PracticeFormPage } from "../../pages/demoqa-practice-form-page.ts";
import { SortablePage } from "../../pages/demoqa-sortable-page.ts";

test.describe("Multi-user: one fills Practice Form while another reorders Sortable Grid (parallel contexts)", () => {
  interface FormInfo {
    readonly name: string;
    readonly lastName: string;
    readonly email: string;
    readonly gender: string;
    readonly mobile: string;
    readonly dateOfBirth: string;
    readonly dateOfBirthValidation: string,
    readonly subjects: string[];
    readonly hobbies: string[];
    readonly hobbiesValidation: string[];
    readonly picturePath: string;
    readonly currentAddress: string;
    readonly state: string;
    readonly city: string;
  }

  const formInfo: FormInfo = {
    name: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    gender: "2", // 1: "Male" | 2: "Female" | 3: "Other"
    mobile: "9876543210", // must be 10 digits for DemoQA form
    dateOfBirth: "10 May 1995", // DemoQA expects "dd mmm yyyy"
    dateOfBirthValidation: "10 May,1995",
    subjects: ["Maths"], // can be multiple subjects
    hobbies: ["1", "2"], // 1: "Sports" | 2: "Reading" | "Music"
    hobbiesValidation: ["Sports", "Reading"],
    picturePath: "img/mob.jpeg", // local relative path to an image
    currentAddress: "123 Elm Street, Springfield",
    state: "NCR", // must match available dropdown options
    city: "Delhi", // must match city for the selected state
  };

  test("Should allow one user to fill the practice form while another user reorders the grid", async ({
    browser,
  }) => {
    // Create two separate browser contexts to simulate different users
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    // Create pages for each user
    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    // User 1: Fill out the Practice Form
    const practiceFormPage = new PracticeFormPage(user1Page);
    await test.step("Navigate to Practice form", async () => {
      await practiceFormPage.goto();
      await expect(user1Page).toHaveURL(practiceFormPage.url);
    });

    const sortablePage = new SortablePage(user2Page);
    await test.step("Navigate to Sorteable page", async () => {
      await sortablePage.goto();
      await expect(user2Page).toHaveURL(sortablePage.url);
    });

    await test.step("Fill practice form and click on submit", async () => {
      await practiceFormPage.fillFormAndSubmit(
        formInfo.name,
        formInfo.lastName,
        formInfo.email,
        formInfo.gender,
        formInfo.mobile,
        formInfo.dateOfBirth,
        formInfo.subjects,
        formInfo.hobbies,
        formInfo.picturePath,
        formInfo.currentAddress,
        formInfo.state,
        formInfo.city
      );
    });

    await test.step("Unsort the grids", async () => {
        const initialOrder = await sortablePage.readOrder();
        expect.soft(initialOrder.length).toBeGreaterThan(0);

        await sortablePage.unOrderGrid();

        const finalOrder = await sortablePage.readOrder();
        expect.soft(finalOrder).not.toEqual(initialOrder);
    });

    await test.step("Check the information from the model is correct in practice form", async () => {

        // Validate fields one by one
        await expect(user1Page.locator("//td[text()='Student Name']/following-sibling::td"))
        .toHaveText(`${formInfo.name} ${formInfo.lastName}`);

        await expect(user1Page.locator("//td[text()='Student Email']/following-sibling::td"))
        .toHaveText(formInfo.email);

        await expect(user1Page.locator("//td[text()='Gender']/following-sibling::td"))
        .toHaveText("Female"); // since gender=2

        await expect(user1Page.locator("//td[text()='Mobile']/following-sibling::td"))
        .toHaveText(formInfo.mobile);

        await expect(user1Page.locator("//td[text()='Date of Birth']/following-sibling::td"))
        .toHaveText(formInfo.dateOfBirthValidation);

        await expect(user1Page.locator("//td[text()='Subjects']/following-sibling::td"))
        .toHaveText(formInfo.subjects.join(", "));

        await expect(user1Page.locator("//td[text()='Hobbies']/following-sibling::td"))
        .toHaveText("Sports, Reading");

        await expect(user1Page.locator("//td[text()='Picture']/following-sibling::td"))
        .toHaveText("mob.jpeg");

        await expect(user1Page.locator("//td[text()='Address']/following-sibling::td"))
        .toHaveText(formInfo.currentAddress);

        await expect(user1Page.locator("//td[text()='State and City']/following-sibling::td"))
        .toHaveText(`${formInfo.state} ${formInfo.city}`);

    });
  });
});
