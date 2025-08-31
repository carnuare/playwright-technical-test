import { type Locator, type Page } from '@playwright/test';

export const DEMOQA_PROFILE_URL = 'https://demoqa.com/profile';

export class ProfilePage {
    page: Page;
    url: string;
    userNameDisplay: Locator;
    logOutButton: Locator;
    goToBookstoreButton: Locator;
    deleteAccountButton: Locator;
    deleteAllBooksButton: Locator;
    typeToSearchInput: Locator;
    tableRows: Locator;
    constructor(page: Page) {
        this.page = page;
        this.url = DEMOQA_PROFILE_URL;
        this.userNameDisplay = page.locator("#userName-value");
        this.logOutButton = page.getByRole('button', { name: 'Log out' });
        this.goToBookstoreButton = page.getByRole('button', { name: 'Go To Book Store' });
        this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });
        this.deleteAllBooksButton = page.getByRole('button', { name: 'Delete All Books' });
        this.typeToSearchInput = page.getByRole('textbox', { name: 'Type to search' });
        this.tableRows = page.getByRole("grid");
        ;
    }

}