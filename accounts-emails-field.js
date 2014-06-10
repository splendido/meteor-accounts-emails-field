
// List of services that do not permit the use of the account to login into another
// website unless the registered email was verified.
// Hence, for the services listed here, we can considered the email address as
// verified even if not specific field stating the verification status is provided!

var whitelistedServices = ['facebook', 'linkedin'];

// Facebook
// It doesn't permit the use of the account unless the email
// ownership is confirmed!
// tested and verified on 2014/06/08
// (see issue #29 at https://github.com/splendido/meteor-accounts-emails-field/issues/29)

// GitHub
// If you register WITHOUT verifying the email you get
// "email": null
// on login, if then set the NON-verified email address as public you get it on login!
// SO, GitHub provided email address cannot be considered as verified!!!
// tested and verified on 2014/06/08

// Linkedin
// It doesn't permit to activate your account unless the email
// ownership is confirmed! ...even if, if you come back later you can access it...
// In any case 3r-party login is not permitted!! 
// tested and verified on 2014/06/08
// (see issue #1 at https://github.com/splendido/meteor-accounts-emails-field/issues/1 )

updateEmails = function(info) {
    // Picks up the user object
    var user = info.user;
    var toBeUpdated = false;
    // Picks up current emails field
    var current_emails = user.emails || [];
    // Updates or adds all emails found inside services
    _.map(user.services, function(service, service_name) {
        if (service_name === 'resume' || service_name === 'email' || service_name === 'password')
            return;
        // Picks up the email address from the service
        // NOTE: different services use different names for the email filed!!!
        //       so far, `email` and `emailAddress` were found but it may be the
        //       new names should be added to support all 3rd-party packages!
        var email = service.email || service.emailAddress;
        if (!email)
            // e.g. GitHub provides a null value in the field "email" in case the email
            //      address is not verified!
            return;

        var verified = false;
        // Tries to determine whether the 3rd-party email was verified
        // NOTE: so far only for the service `google` it was found a field
        //       called `verified_email`. But it may be that new names 
        //       should be atted to better support all 3rd-party packages!
        if (_.indexOf(whitelistedServices, service_name) > -1)
            verified = true;
        else if (service.verified_email)
            verified = true;

        // Look for the same email address inside current_emails
        // email_id === -1 means not found!
        var email_id = _.chain(current_emails)
            .map(function(e) {return e.address === email;})
            .indexOf(true)
            .value();
        if (email_id === -1) {
            // In case the email is not present, adds it to the array
            current_emails.push({
                address: email,
                verified: verified
            });
            toBeUpdated = true;
        } else {
            if (verified && !current_emails[email_id].verified) {
                // If the email was found but its verified state should be promoted
                // to true, updates the array element
                toBeUpdated = true;
                current_emails[email_id].verified = true;
            }
        }
    });
    // Extracts current services emails
    var services_emails = [];
    if (user.services.password)
    // If password is among services, adds the password email not to delete it...
        services_emails.push(current_emails[0].address);
    _.map(user.services, function(service, service_name) {
        if (service_name === 'resume' || service_name === 'email' || service_name === 'password')
            return;
        var email = service.email || service.emailAddress;
        if (email && _.indexOf(services_emails, email) == -1)
            services_emails.push(email);
    });
    // Keeps only emails from the current emails field which
    // also appears inside services_emails
    // ...some email address might have 
    var emails = _.reject(current_emails, function(email) {
        return _.indexOf(services_emails, email.address) == -1;
    });
    // Eventually checks whether to update the emails field
    //if (toBeUpdated)
    //    Meteor.users.update({_id: user._id}, {$set: {emails: emails}});
    Meteor.users.update({_id: user._id}, {$set: {registered_emails: emails}});
    // Updates also current user object to be later used during the same callback...
    user.registered_emails = emails;
};

// Sets up an index on registered_emails
Meteor.users._ensureIndex('registered_emails.address');
