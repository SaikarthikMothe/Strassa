import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainRepairOutcome = () => {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);
  const [processing, setProcessing] = useState(false);

  // 🔑 PART FLAGS
  const [partAttempted, setPartAttempted] = useState(null); // null = not decided
  const [partInstalled, setPartInstalled] = useState(false);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/repair/${repairRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRepair(res.data);
      } catch {
        alert("Failed to load repair");
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairRequestId]);

  const submit = async () => {
    if (!action) return;

    if (action === "NOT_FIXABLE") {
      if (!reason.trim()) {
        alert("Please provide a reason");
        return;
      }

      // 🔥 HARD GUARD — this was missing earlier
      if (partAttempted === null) {
        alert("Please confirm whether you attempted a part replacement");
        return;
      }

      if (partInstalled && partAttempted !== true) {
        alert("Invalid selection");
        return;
      }
    }

    setProcessing(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/${
          action === "COMPLETED" ? "complete" : "not-fixable"
        }`,
        action === "COMPLETED"
          ? { repairId: repairRequestId }
          : {
              repairId: repairRequestId,
              reason,
              partAttempted,
              partInstalled,
            },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/captain-home");
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex justify-center">
      <div className="w-full max-w-[420px] h-screen flex flex-col text-white">

        {/* HEADER */}
        <div className="px-5 py-6">
          <h1 className="text-2xl font-semibold">Repair Outcome</h1>
          <p className="text-sm text-gray-400 mt-1">
            Issue: <span className="text-white">{repair.issue}</span>
          </p>
        </div>

        {/* MAIN */}
        <div className="flex-1 px-5 space-y-5 overflow-y-auto">

          <button
            onClick={() => setAction("COMPLETED")}
            className={`w-full py-5 rounded-2xl text-lg font-semibold ${
              action === "COMPLETED"
                ? "bg-green-500 text-black"
                : "border border-gray-600"
            }`}
          >
            Repair Completed
          </button>

          <button
            onClick={() => {
              setAction("NOT_FIXABLE");
              setPartAttempted(null); // reset decision
              setPartInstalled(false);
            }}
            className={`w-full py-5 rounded-2xl text-lg font-semibold ${
              action === "NOT_FIXABLE"
                ? "bg-red-600"
                : "border border-gray-600"
            }`}
          >
            Not Fixable
          </button>

          {/* NOT FIXABLE DETAILS */}
          {action === "NOT_FIXABLE" && (
            <>
              <div className="bg-gray-900 rounded-xl p-4 space-y-4">

                <p className="text-sm text-gray-400">
                  Was a part replacement attempted?
                </p>

                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="partAttempted"
                    checked={partAttempted === false}
                    onChange={() => {
                      setPartAttempted(false);
                      setPartInstalled(false);
                    }}
                  />
                  No part was attempted
                </label>

                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="partAttempted"
                    checked={partAttempted === true}
                    onChange={() => setPartAttempted(true)}
                  />
                  A part was attempted
                </label>

                {partAttempted === true && (
                  <label className="flex items-center gap-3 text-sm ml-6">
                    <input
                      type="checkbox"
                      checked={partInstalled}
                      onChange={(e) => setPartInstalled(e.target.checked)}
                    />
                    Part installed and left with vehicle (user will be charged)
                  </label>
                )}
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason why repair is not possible on-site"
                className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white text-sm resize-none"
                rows={3}
              />
            </>
          )}
        </div>

        {/* CONFIRM BAR */}
        {action && (
          <div className="px-5 py-4 border-t border-gray-800 bg-black">
            <div className="flex gap-3">
              <button
                onClick={() => setAction(null)}
                className="flex-1 py-3 rounded-xl border border-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                disabled={processing}
                className={`flex-1 py-3 rounded-xl font-semibold ${
                  action === "COMPLETED"
                    ? "bg-green-500 text-black"
                    : "bg-red-600"
                }`}
              >
                {processing ? "Submitting…" : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainRepairOutcome;
