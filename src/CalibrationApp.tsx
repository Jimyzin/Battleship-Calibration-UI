import React, { useState, ChangeEvent, FormEvent } from "react";

interface CalibrationSettings {
  caliber: number;
  location: string;
  rotation_start_point: number;
  rotation_end_point: number;
  rotations: number;
}

const CalibrationApp: React.FC = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Form fields states
  const [caliber, setCaliber] = useState(102);
  const [location, setLocation] = useState("Bow");
  const [rotationStartPoint, setRotationStartPoint] = useState(0);
  const [rotationEndPoint, setRotationEndPoint] = useState(0);
  const [rotations, setRotations] = useState(0);

  // Validation errors state
  const [errors, setErrors] = useState<string[]>([]);
  // Run button enable state
  const [isRunEnabled, setIsRunEnabled] = useState(false);
  // Run result state
  const [runResult, setRunResult] = useState<number | null>(null);
  // Run result state - Total Rotation in Degree
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  // Run result state - Number of tests
  const [numberOfTests, setNumberOfTests] = useState<number | null>(null);

  // Validate form fields based on provided rules
  const validateForm = (): boolean => {
    const errs: string[] = [];

    if (caliber < 102 || caliber > 450) {
      errs.push("Caliber must be between 102 and 450.");
    }
    if (location !== "Bow" && location !== "Stern") {
      errs.push('Location must be either "Bow" or "Stern".');
    }
    if (rotationStartPoint < 0 || rotationStartPoint > 180) {
      errs.push("Rotation Start Point must be between 0 and 180.");
    }
    if (rotationEndPoint < 0 || rotationEndPoint > 180) {
      errs.push("Rotation End Point must be between 0 and 180.");
    }
    if (rotationEndPoint <= rotationStartPoint) {
      errs.push(
        "Rotation End Point must be greater than Rotation Start Point."
      );
    }
    if (!Number.isInteger(rotations) || rotations < 0) {
      errs.push("Rotations must be a non-negative integer.");
    }

    setErrors(errs);
    return errs.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRunResult(null);
    setIsRunEnabled(false);

    if (!validateForm()) {
      return;
    }

    const payload: CalibrationSettings = {
      caliber,
      location,
      rotation_start_point: rotationStartPoint,
      rotation_end_point: rotationEndPoint,
      rotations,
    };

    try {
      const response = await fetch(`${baseUrl}/calibration/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 202) {
        // Enable Run button if settings have been accepted
        setIsRunEnabled(true);
      } else {
        // Else, display errors
        const errorMsg = await response.text();
        setErrors([`Submit failed: ${errorMsg}`]);
      }
    } catch (error: any) {
      setErrors([`Submit error: ${error.message}`]);
    }
  };

  // Handle Run button click
  const handleRun = async () => {
    try {
      const response = await fetch(`${baseUrl}/calibration/run`, {
        method: "POST",
      });
      if (!response.ok) {
        // Show eerors if run api call failed
        const errorMsg = await response.text();
        setErrors([`Run call failed: ${errorMsg}`]);
        return;
      }
      const result = await response.json();

      // On successful run api call, set total distance in degree,
      // number of tests and disable run button to allow next settings
      setTotalDistance(result.distance_in_degrees);
      setNumberOfTests(result.number_of_tests);
      setIsRunEnabled(false);
    } catch (error: any) {
      setErrors([`Run error: ${error.message}`]);
    }
  };

  // Input change handlers
  const handleCaliberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaliber(Number(e.target.value));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const handleRotationStartPointChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRotationStartPoint(Number(e.target.value));
  };

  const handleRotationEndPointChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRotationEndPoint(Number(e.target.value));
  };

  const handleRotationsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRotations(Number(e.target.value));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Calibration Settings</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>
            Caliber (102-450):
            <input
              type="number"
              value={caliber}
              onChange={handleCaliberChange}
              min={102}
              max={450}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <select value={location} onChange={handleLocationChange}>
              <option value="Bow">Bow</option>
              <option value="Stern">Stern</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Rotation Start Point (0-180):
            <input
              type="number"
              value={rotationStartPoint}
              onChange={handleRotationStartPointChange}
              min={0}
              max={180}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Rotation End Point (0-180, &gt; Start Point):
            <input
              type="number"
              value={rotationEndPoint}
              onChange={handleRotationEndPointChange}
              min={0}
              max={180}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Rotations (integer):
            <input
              type="number"
              value={rotations}
              onChange={handleRotationsChange}
              required
            />
          </label>
        </div>
        {errors.length > 0 && (
          <div style={{ color: "red", margin: "1em 0" }}>
            <ul>
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      <br />
      <button onClick={handleRun} disabled={!isRunEnabled}>
        Run
      </button>
      {totalDistance !== null && (
        <div style={{ marginTop: "1em" }}>
          <strong>Total Distance in Degrees:</strong> {totalDistance}
        </div>
      )}
      {numberOfTests !== null && (
        <div style={{ marginTop: "1em" }}>
          <strong>Number of tests:</strong> {numberOfTests}
        </div>
      )}
    </div>
  );
};

export default CalibrationApp;
