## App Screenshots

Full implementation of an appointment booking app using MERN stack.
![alt text](https://github.com/panda3141592/Appointment-Scheduling-MERN/blob/main/ui.png?raw=true)

## How to run the program

Start the Node.JS Server:

1. `cd back-end` to move into the folder
2. `npm i`, to install all required dependencies
3. Creata a `.env` file with the follwing info from firebase

```
REACT_APP_FIREBASE_API_KEY = ""
REACT_APP_FIREBASE_AUTH_DOMAIN = ""
REACT_APP_FIREBASE_PROJECT_ID = ""
REACT_APP_FIREBASE_STORAGE_BUCKET = ""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ""
REACT_APP_FIREBASE_APP_ID = ""
```

4. `npm start` to start the server

Run the Front-end webapp:

1. `cd front-end` to move into the folder
2. `npm i`, to install all required dependencies
3. `npm start` to start the server

\*Make sure the Node.JS Server is running while using the react app

\*The database is set to be accessible to all IP (all required .env files are included in the .zip)

## Back-end structure

The back-end uses NodeJS, Express, MonogoDB, and Firebase. The back-end stores data using three collections: bookings, doctors, and patients. The definition of each crud function can be found in the `back-end/controllers` folder and the models can be found in the `back-end/models` folder.

### Patients:

- /create
- /getAll
- /getPatient/:patientId
- /addAppointment/:patientId
- /removeAppointment/:patientId

| field       | type       |
| ----------- | ---------- |
| \_id        | String     |
| bookedTimes | [Date]     |
| bookings    | [ObjectId] |

### Doctors:

- /create
- /getAll
- /addAvailable/:doctorId
- /removeAvailable/:doctorId
- /getDoctor/:doctorId
- /bookTime/:doctorId
- /unbookTime/:doctorId

| field          | type       |
| -------------- | ---------- |
| \_id (default) | ObjectId   |
| name           | String     |
| availableTimes | [Date]     |
| bookings       | [ObjectId] |
| specialization | String     |

### Bookings:

- /create
- /getAll
- /getBooking/:bookingId
- /removeBooking/:bookingId

| field          | type     |
| -------------- | -------- |
| \_id (default) | ObjectId |
| patientId      | String   |
| doctorId       | ObjectId |
| time           | Date     |

The field bookings in Patients and the field bookings in Doctors stores an array of ObjectId that corresponds to \_id(default) in Bookings.

## Front-end Structure

The front-end using React with AntD for UI components. Each page of the web can be found in the `front-end/pages` folder. The app includes three pages related to authentication: login, register, and forgot password. The app has two main content pages for patients: profile and booking.
