# Talkcorner App

Public chat room connected to Socket Io.
Saves messages in a SQL database in Turso App. Displays connected users in the side panel.
Allows editing the name and stores it in the localstorage.

![screenshot](/talkcorner/public/screenshot.png?raw=true)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)

## Features

- Chat to connected people.
- Your username is stored locally.

## Requirements

Before you get started, ensure that you have the following dependencies installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/maritocuate/talkcorner.git
   ```

2. Navigate to the project directory:

   ```bash
   cd talkcorner
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Setup .env files:

   ```bash
   DATABASE_URL="tursodb-url"
   DATABASE_AUTH_TOKEN="tursodb-token"
   ```
