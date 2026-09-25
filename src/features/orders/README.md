# Orders

An approved organization requests an available donation in a Firestore transaction. The order and donation move together through requested, pickup, and received. A six digit pickup reference helps people identify the handoff. Donors confirm handoff; the requesting organization confirms receipt. Each transition creates a participant notification.
