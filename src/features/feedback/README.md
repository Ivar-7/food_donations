# Feedback

`/feedback` lets signed-in members send a rating, category and message, then view their own submissions. The form and API validate input. Firestore limits reads to the author and administrators; submissions cannot be edited or deleted by clients. The page handles signed-out, loading, empty, sending, success and error states.
