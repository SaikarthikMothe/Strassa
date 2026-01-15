import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RepairDetailsForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialIssue = state?.issue || "";
  const location = state?.location;

  // ✅ FIX: Proper guard
  if (!location) {
    return <div style={{ color: "white" }}>Fetching location...</div>;
  }

  const [form, setForm] = useState({
    vehicleType: "",
    make: "",
    model: "",
    vehicleNumber: "",
    problem: initialIssue || "",
    notes: "",
  });

  const isNotSure = initialIssue === "Not Sure";
  const isLockedIssue = initialIssue && initialIssue !== "Not Sure";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isNotSure && form.problem.trim().length < 10) {
      alert("Please describe the issue clearly so the mechanic can help.");
      return;
    }

    try {
      // ✅ FIX: Capture response
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/create`,
        {
          issue: isNotSure ? "Issue not specified" : initialIssue,
          notes: form.problem,
          vehicleType: form.vehicleType,
          make: form.make,
          model: form.model,
          vehicleNumber: form.vehicleNumber,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ FIX: Get repairId from backend
      const repairId = res.data._id;

      // ✅ FIX: Correct route navigation
      navigate(`/repair/searching/${repairId}`);
    } catch (err) {
      console.error("❌ Failed to create repair:", err);
      alert("Failed to request mechanic. Please try again.");
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Vehicle Details</h2>

        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="auto">Auto</option>
        </select>

        <input
          name="make"
          placeholder="Make (e.g. Honda)"
          value={form.make}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="model"
          placeholder="Model (e.g. City)"
          value={form.model}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="vehicleNumber"
          placeholder="Vehicle Number (optional)"
          value={form.vehicleNumber}
          onChange={handleChange}
          style={styles.input}
        />

        <h2 style={styles.heading}>Problem Details</h2>

        <textarea
          name="problem"
          value={form.problem}
          onChange={handleChange}
          disabled={isLockedIssue}
          placeholder={
            isLockedIssue
              ? "Issue selected from services"
              : "Please describe the issue clearly"
          }
          style={styles.textarea}
        />

        <textarea
          name="notes"
          placeholder="Any additional notes (optional)"
          value={form.notes}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
};

/* ✅ STYLES */
const styles = {
  screen: {
    minHeight: "100vh",
    backgroundColor: "#000",
    padding: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#0b0b0b",
    borderRadius: "16px",
    padding: "20px",
    color: "#fff",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#000",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "80px",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#facc15",
    color: "#000",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  },
};

export default RepairDetailsForm;
