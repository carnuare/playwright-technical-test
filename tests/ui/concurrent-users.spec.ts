import { test, expect } from "@playwright/test";
import { PracticeFormPage } from "../../pages/multi-user/demoqa-practice-form-page.ts";
import { SortablePage } from "../../pages/multi-user/demoqa-sortable-page.ts";

test.describe("Multi-user: one fills Practice Form while another reorders Sortable Grid (parallel contexts)", () => {
  type Gender = "1" | "2" | "3";
  type Hobby = "1" | "2" | "3"; // Even though they are duplicates, for maintenance it is acceptable to have them separated in case more items are added

  interface FormInfo {
    readonly name: string;
    readonly lastName: string;
    readonly email: string;
    readonly gender: Gender;
    readonly mobile: string;
    readonly dateOfBirth: string;
    readonly dateOfBirthValidation: string;
    readonly subjects: string[];
    readonly hobbies: Hobby[];
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
    dateOfBirth: "25 May 1995", // DemoQA expects "dd mmm yyyy"
    dateOfBirthValidation: "25 May,1995",
    subjects: ["Maths", "Chemistry"], // can be multiple subjects
    hobbies: ["1", "2"], // 1: "Sports" | 2: "Reading" | 3: "Music"
    picturePath: "img/mob.jpeg", // local relative path to an image
    currentAddress: "123 Elm Street, Springfield",
    state: "NCR", // must match available dropdown options
    city: "Delhi", // must match city for the selected state
  };

  const mapGender = {
    "1": "Male",
    "2": "Female",
    "3": "Other",
  };

  const mapHobbies = {
    "1": "Sports",
    "2": "Reading",
    "3": "Music",
  };

  test("Should allow one user to fill the practice form while another user reorders the grid", async ({
    browser,
  }) => {
    // Create two separate browser contexts to simulate different users
    const user1Context = await browser.newContext(); // Form browser
    const user2Context = await browser.newContext(); // Sort browser

    // Create pages for each user
    const user2Page = await user2Context.newPage();
    const user1Page = await user1Context.newPage();

    // User 1: Fill out the Practice Form
    const practiceFormPage = new PracticeFormPage(user1Page);
    await test.step("Navigate to Practice form", async () => {
      await practiceFormPage.goto();
      await expect(user1Page, "Browser should be in the correct url").toHaveURL(
        practiceFormPage.url
      );
    });

    // User 2: Unsort the grid
    const sortablePage = new SortablePage(user2Page);
    await test.step("Navigate to Sorteable page", async () => {
      await sortablePage.goto();
      await expect(user2Page, "Browser should be in the correct url").toHaveURL(
        sortablePage.url
      );
    });

    await test.step("Fill practice form", async () => {
      await practiceFormPage.fillForm(
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
      expect(
        initialOrder.length,
        "There should be items in the grid"
      ).toBeGreaterThan(0);

      await sortablePage.unOrderGrid();

      const finalOrder = await sortablePage.readOrder();
      expect
        .soft(
          finalOrder,
          "The order of the items after unsorting should no be equal to the initial order"
        )
        .not.toEqual(initialOrder);
    });

    await test.step("Submit the form", async () => {
      await practiceFormPage.submitForm();
      await expect(practiceFormPage.formModal).toBeVisible();
    });

    await test.step("Verify submitted form information matches model data", async () => {
      // Helper function to get field locator
      const getFieldValueLocator = (fieldName: string) => {
        return user1Page.locator(
          `//td[text()='${fieldName}']/following-sibling::td`
        );
      };

      // Validate fields one by one with clear error messages
      await expect(
        getFieldValueLocator("Student Name"),
        "Student name should match first and last name"
      ).toHaveText(`${formInfo.name} ${formInfo.lastName}`);

      await expect(
        getFieldValueLocator("Student Email"),
        "Student email should match submitted email"
      ).toHaveText(formInfo.email);

      await expect(
        getFieldValueLocator("Gender"),
        "Gender should display as Female for gender code 2"
      ).toHaveText(mapGender[formInfo.gender]);

      await expect(
        getFieldValueLocator("Mobile"),
        "Mobile number should match submitted value"
      ).toHaveText(formInfo.mobile);

      await expect(
        getFieldValueLocator("Date of Birth"),
        "Date of birth should match formatted validation date"
      ).toHaveText(formInfo.dateOfBirthValidation);

      await expect(
        getFieldValueLocator("Subjects"),
        "Subjects should be comma-separated list"
      ).toHaveText(formInfo.subjects.join(", "));

      await expect(
        getFieldValueLocator("Hobbies"),
        "Hobbies should display selected options"
      ).toHaveText(
        formInfo.hobbies.map((hobby) => mapHobbies[hobby]).join(", ")
      );

      await expect(
        getFieldValueLocator("Picture"),
        "Picture filename should match uploaded file"
      ).toHaveText("mob.jpeg");

      await expect(
        getFieldValueLocator("Address"),
        "Address should match submitted current address"
      ).toHaveText(formInfo.currentAddress);

      await expect(
        getFieldValueLocator("State and City"),
        "State and City should be properly formatted"
      ).toHaveText(`${formInfo.state} ${formInfo.city}`);
    });
  });
});
