# Wanderlust Backend

This is the backend of the Wanderlust app. Wanderlust was developed as part of a class at the [Media University Stuttgart](https://www.hdm-stuttgart.de/english). Wanderlust is supposed to help backpackers to connect with fellow backpackers and to share their favorite places. It isn't published and this backend isn't deployed anywhere.

## Setup

### Prerequisites

Before running this service you need to install:
- Node.js
- NPM
- MongoDB

Also, you need to generate [Google OAuth2 credentials](https://console.developers.google.com) and add your client id to the configuration file. Furthermore, in order for the backend being able to send notifications to devices, you need to set up a [firebase](https://firebase.google.com/) project and add its credentials and URL to the configuration file.

### Installation

1. Clone this repository
2. Run `npm install` inside the newly created directory

### Run

1. Make sure your local MongoDB is running
2. Run `npm start`

An admin with the username _admin_ and the password _1234_ is created automatically. In any but a local environment, please change this password.

You can find the API docs under <http://localhost:3000/docs>
