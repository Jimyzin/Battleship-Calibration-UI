# Calibration App

This is a React application built with TypeScript that provides a calibration settings form. It validates input fields and communicates with a backend via REST calls.

## Features

- **Calibration Form:**
  - **Caliber:** Numeric field between 102 and 450.
  - **Location:** Dropdown with "Bow" and "Stern" options.
  - **Rotation Start Point:** Numeric input (0-180).
  - **Rotation End Point:** Numeric input (0-180) that must be greater than the start point.
  - **Rotations:** Non-negative integer.
- **Submit Button:** Sends form data as a JSON payload to `http://localhost:8111/calibrations/settings` and enables the "Run" button upon receiving a `202` response.
- **Run Button:** Makes a POST request to `http://localhost:8111/calibrations/run` (with no body) and displays the returned integer.

## Running the App

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run App:**
   ```bash
   npm run start
   ```

## Assumptions

- `Rotation Start Point` and `Rotation End Point` will always be integers.
- `Number of times a turret is tested` is equal to number of times `run` is triggered for a specific turret.
- `Number of times a turret is tested` must be able to withstand application reboots.
- None of the turret setting parameters are persisted for future use or to withstand applications reboots. However, a log is maintained.
- `Run` always triggers the latest turret setting

### Choice of Technology

`React v18.2` has been selected as the frontend technology due to the following reasons.

- My familiarity with the technology and my available local setup.
- Lightweight framework for this simple code challenge

### Improvements

- Dockerise to keep a consistent image across environments.
- Adding security in form of `API Key` to access backend api's from frontend.
