
// Register `updateEmails` function under the `onLogin` hook so to
// check/update the `emails` field at every new login!
Accounts.onLogin(updateEmails);