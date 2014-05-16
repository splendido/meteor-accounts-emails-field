accounts-emails-field
=====================

This is a Meteor package which mantains the `emails` array field inside the user object up to date with any 3rd-party account service used by the application.

It exploits the `onLgin` hook to check the user object and possibly updates the content of the `emails` field.
