// This Vite config file (vite.config.js) tells Rollup (production bundler) 
// to treat multiple HTML files as entry points so each becomes its own built page.

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                accountInfo: resolve(__dirname, "account-info.html"),
                account: resolve(__dirname, "account.html"),
                filter: resolve(__dirname, "filter.html"),
                index: resolve(__dirname, "index.html"),
                listingInfo: resolve(__dirname, "listing-info.html"),
                listingsHomepage: resolve(__dirname, "listings-homepage.html"),
                listings: resolve(__dirname, "listings.html"),
                login: resolve(__dirname, "login.html"),
                main: resolve(__dirname, "main.html"),
                newListing: resolve(__dirname, "new-listing.html"),
                savedListings: resolve(__dirname, "saved-listings.html"),
                setUpAccount: resolve(__dirname, "set-up-account.html"),
                skills: resolve(__dirname, "skills.html")
            }
        }
    }
});
