import { type Page } from "@playwright/test";

export const DEMOQA_SORTABLE_URL =
  "https://demoqa.com/sortable#google_vignette";

export class SortablePage {
  page: Page;
  url: string;
  constructor(page: Page) {
    this.page = page;
    this.url = DEMOQA_SORTABLE_URL;
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState("domcontentloaded");
  }

//   async blockAds() {
//     await this.page.route("**/*", async (request) => {
//         const reqUrl = request.request().url();
//         if (reqUrl.includes("ads")) {
//             request.abort();
//         } else {
//             request.continue();
//         }
//        });
//   }

  async switchToGridTab() {
    // Prefer role if present; fallback to id
    const gridTab = this.page.getByRole("tab", { name: "Grid" });
    if (await gridTab.count()) {
      await gridTab.click();
    } else {
      await this.page.locator("#demo-tab-grid").click();
    }

    await this.page.locator("#demo-tabpane-grid").waitFor();
  }

  private gridContainer() {
    return this.page.locator("#demo-tabpane-grid");
  }

  private gridItems() {
    // Items typically have class like .list-group-item; keep it flexible:
    return this.gridContainer().locator("div").filter({
      hasText: /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine)\s*$/,
    });
  }

  async readOrder(): Promise<string[]> {
    const texts = await this.gridItems().allInnerTexts();
    // Normalize whitespace
    return texts.map((t) => t.trim());
  }

  async unOrderGrid() {
    await this.switchToGridTab();

    // Move "Nine" to the position of "One" to break the default order
    const source = this.gridContainer().getByText("Nine", { exact: true });
    const target = this.gridContainer().getByText("One", { exact: true });

    await source.dragTo(target);
  }
}
