# Family Travel Tracker

## Description

Family Travel Tracker is a web application that allows users to track the countries they have visited. Users can manage their profile and add new countries they have visited. The application also supports adding new family members with different colors for easier identification.

## Features

- **User Management:** View existing users and add new family members.
- **Country Tracking:** Add and view the countries visited by the current user.
- **Dynamic UI:** User-specific color preferences and country visit tracking are displayed dynamically on a map.

## Technologies

- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, EJS
- **Middleware:** body-parser

## Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd family-travel-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:

   ```env
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_DATABASE=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=your_db_port
   ```

4. **Run the application:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## Usage

- **Homepage:** Displays all users and their visited countries. Allows switching between users and adding new countries.
- **Add Family Member:** Accessed via the "Add Family Member" button. Allows adding a new user with a selected color.
- **Add Country:** Input a country name to add it to the list of visited countries for the current user.

## Database Schema

The database includes the following tables:

- **users:** Stores user information.
- **visited_countries:** Tracks countries visited by users.

## Example Queries

- **View all users:**

  ```sql
  SELECT * FROM users;
  ```

- **Check visited countries for a specific user:**

  ```sql
  SELECT country_code FROM visited_countries WHERE user_id = $1;
  ```
