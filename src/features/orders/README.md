# Orders

An approved organization requests an available donation in a Firestore transaction. The order and donation move together through requested, pickup, and received. A six digit pickup reference helps people identify the handoff. Donors confirm handoff; the requesting organization confirms receipt. Each transition creates a participant notification.

The shared request control appears on donation cards and the details page; guests return after login, and unregistered members see organization application guidance. Presentation donations support the full workflow. Duplicate requests and invalid transitions are rejected by the API transaction.
