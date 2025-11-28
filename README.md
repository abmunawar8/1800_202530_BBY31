# Volunteering Made Easy

## Overview

Volunteering Made Easy is a client-side JavaScript web application that helps users discover and provide volunteering opportunities. The app displays a curated list of volunteering listings based on skills that the user has, each with details such as location, skills required, and an image. Users can browse through other listing via filters and mark listings that they prefer for easy access later.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user favorites.

---

## Features

- Browse a list of volunteering listings with images and details that have been curated based on skills the user has
- Create a new volunteer listing for others to see
- Update account information as the user sees fit
- View the full details of any volunteer listing
- Mark and unmark listings as saved or unsaved for future reference
- View a personalized list of volunteer listings by updating their skills list if needed
- Use filters to find volunteer listings based on skills that the user wants to apply
- Responsive design for desktop and mobile devices

---

## Technologies Used

Example:

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---

## Usage

1. Open your browser and visit `http://localhost:5173`.
2. Navigate to the center of the page and click `Join Today`.
3. Click the signup link under the login button to make a new account.
4. Fill in the details to create a new account, and click sign up.
5. Click the specific skills that you currently have, and click confirm.
6. Browse the list of volunteer opportunities displayed on the main page.
7. Click the bookmark icon to save a listing for later.
8. View your saved listings in the account section located in the bottom navbar.

---

## Project Structure

```
1800_202530_BBY31/
├── .vscode/
│   │── launch.json
│   │── settings.json
├── src/
│   ├── components/
│   │   │── filter-navbar.js
│   │   │── listing-info.js
│   │   │── listings-navbar.js
│   │   │── main-footer.js
│   │   │── main-navbar.js
│   │   │── site-footer.js
│   │   ├── site-navbar.js
│   │── account-info.js
│   │── account.js
│   │── app.js
│   │── authentication.js
│   │── filter.js
│   │── firebaseConfig.js
│   │── listing-info.js
│   │── location-autocomplete.js
│   │── loginSignup.js
│   │── main.js
│   │── new-listing.js
│   │── save-listing.js
│   │── saved-listings.js
│   │── set-up-account.js
│   ├── skills.js
├── styles/
│   │── new-listing.css
│   │── saved-listings.css
│   │── set-up-account.css
│   ├── style.css
├── node_modules/
├── .env
├── .gitignore
├── images/
├── fonts/
├── account-info.html
├── account.html
├── filter.html
├── index.html
├── listing-info.html
├── listings-homepage.html
├── listings.html
├── login.html
├── main.html
├── new-listing.html
├── saved-listings.html
├── set-up-account.html
├── skeleton.html
├── skills.html
├── package-lock.json
├── package.json
├── README.md
```

---

## Contributors

- **Abdullah Munawar** - BCIT CST Student with a passion for coding, and loves problem solving to help others. Fun fact: Loves going on walks on a nice sunny or chilly day.
- **Mischa Potter** - BCIT CST Student who enjoys making code work! Fun facts: can solve a Rubik's cubes in under 30 seconds, is an identical twin.
- **Xinwei Zhou** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Like playing with computer games.

---

## Acknowledgments

- Code snippets were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/).

---

## Limitations and Future Work

### Limitations

- Accessibility features can be further improved.

### Future Work

- Scrape web for volunteer opportunities (use API)

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
