# Community Library Management System

## Overview

The Community Library Management System is a static front-end application designed to manage library resources, including books, patrons, donations, and genres. This project allows users to perform CRUD (Create, Read, Update, Delete) operations through a user-friendly interface built with HTML, CSS, and JavaScript.

## Project Structure

```
community-library-management
├── public_html
│   ├── index.html          # Homepage with links to all pages
│   ├── books.html         # View and manage books
│   ├── patrons.html       # View and manage patrons
│   ├── donations.html     # View and manage donations
│   ├── genres.html        # View and manage genres
│   ├── borrowed_books.html # View and manage borrowed books
│   ├── css
│   │   └── styles.css     # Basic styling for the application
│   ├── js
│   │   └── scripts.js     # Client-side JavaScript for validation and interactivity
│   └── images             # Directory for storing images
└── README.md              # Project documentation
```

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the `public_html` directory.
3. Open `index.html` in a web browser to view the homepage.
4. Use the navigation links to access different sections of the library management system.

## Features

- **Books Management**: View all books and add or edit book entries.
- **Patrons Management**: View patrons and manage their information.
- **Donations Management**: Track donations made to the library.
- **Genres Management**: Manage the genres available in the library.
- **Borrowed Books Management**: Keep track of borrowed books and manage checkouts and returns.

## Future Enhancements

- Implement backend functionality for persistent data storage.
- Add user authentication for secure access to the system.
- Enhance client-side validation for better user experience.

## License

This project is open-source and available for modification and distribution under the MIT License.
