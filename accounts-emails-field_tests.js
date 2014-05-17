// Copy of the function updateEmails otherwise not accessible from here!
var updateEmails = function(info) {
    // Picks up the user object
    var user = info.user;
    var toBeUpdated = false;
    // Picks up current emails field
    var current_emails = user.emails || [];
    // Updates or adds all emails found inside services
    _.map(user.services, function(service, service_name) {
        if (service_name === 'resume' || service_name === 'email' || service_name === 'password')
            return;
        var email = service.email || service.emailAddress;
        var verified = false;
        if (service.verified_email)
            verified = true;
        var email_id = _.chain(current_emails)
            .map(function(e) {
                return e.address === email;
            })
            .indexOf(true)
            .value();
        if (email_id === -1) {
            current_emails.push({
                address: email,
                verified: verified
            });
            toBeUpdated = true;
        } else {
            if (verified && !current_emails[email_id].verified) {
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
    if (toBeUpdated)
        Meteor.users.update({
            _id: user._id
        }, {
            $set: {
                emails: emails
            }
        });
};

// User from accounts-password service with one non-verified email inside `emails` field
var user1 = {
    "emails": [{
        "address": "pippo@example.com",
        "verified": false
    }],
    "profile": {},
    "services": {
        "password": {
            "srp": {
                "identity": "N30hBwnblcKdaPEfYsU8sfu3_g",
                "salt": "RoNU0BON_XZlVcZ31kE3mDD-tRK",
                "verifier": "4a7c3"
            }
        },
        "resume": {
            "loginTokens": [{
                "when": "2014-05-16T23:20:59.417Z",
                "hashedToken": "t63V/D9E="
            }]
        }
    }
}

// User from accounts-password service with one verified email inside `emails` field
var user2 = {
    "emails": [{
        "address": "pippo@example.com",
        "verified": true
    }],
    "profile": {},
    "services": {
        "password": {
            "srp": {
                "identity": "N30hBwXBEz7i7nblcKdaPEfYsU8sfu3_g",
                "salt": "RoNU0BON_XZlVcHjqECZ31kE3mDD-tRK",
                "verifier": "4a7c3df8c7f"
            }
        },
        "resume": {
            "loginTokens": [{
                "when": "2014-05-16T23:20:59.417Z",
                "hashedToken": "t6y9di8N4sbhXI1ml3V/hD9E="
            }]
        }
    }
}

// User from 3rd-party service with no `emails` field
var user3 = {
    "profile": {
        "firstName": "Pippo",
        "headline": "Super Pippo",
        "lastName": "Pippo",
        "emailAddress": "pippo@best.com",
        "location": {
            "name": "London, Uk"
        },
        "numConnections": 142,
        "pictureUrl": "http://m.c.lnkd.licdn.com/NFEGIJ5Mw",
        "publicProfileUrl": "http://www.linkedin.com/pub/4b9"
    },
    "services": {
        "linkedin": {
            "id": "56083853",
            "accessToken": "A8_sKJ4m8HgxJsOGMo_KPj5TU",
            "expiresAt": 1405403108484,
            "firstName": "Pippo",
            "headline": "Super Pippo",
            "lastName": "Pippo",
            "emailAddress": "pippo@best.com",
            "location": {
                "name": "London, Uk"
            },
            "numConnections": 142,
            "pictureUrl": "http://m.c.lnkd.licdn.com/NFEGIJ5Mw",
            "publicProfileUrl": "http://www.linkedin.com/pub/4b9"
        },
        "resume": {
            "loginTokens": [{
                "when": "2014-05-17T00:23:44.828Z",
                "hashedToken": "WkKb5E="
            }]
        }
    }
}

// User from accounts-password service with one non verified email inside `emails` field
// plus a 3rd party service using the same email, but verified
var user4 = {
    "emails": [{
        "address": "pippo@example.com",
        "verified": false
    }],
    "profile": {},
    "services": {
        "google": {
            "accessToken": "ya29.GAAaJ2JtofCXKEL364js7kzmQ",
            "expiresAt": 1400286604854,
            "id": "10489462794919007",
            "email": "pippo@example.com",
            "verified_email": true,
            "name": "Mr. Pippo Pippo",
            "given_name": "Pippo",
            "family_name": "Pippo",
            "picture": "https://lh3.googleusercontent.com/photo.jpg",
            "locale": "en_US",
            "gender": "male"
        },
        "password": {
            "srp": {
                "identity": "N30hYgzDlJz7i7nblcKdaPEfYsU8sfu3_g",
                "salt": "RoNU0BON_CZ31kE3mDD-tRK",
                "verifier": "4a7c3d"
            }
        },
        "resume": {
            "loginTokens": [{
                "when": "2014-05-16T23:20:59.417Z",
                "hashedToken": "t6y9di8Nws/b4sbh9E="
            }]
        }
    }
}

// User from accounts-password service with one non verified email inside `emails` field
// plus a 3rd party service using the another email which was changed after the last login
var user5 = {
    "emails": [{
        "address": "pippo@example.com",
        "verified": false
    }, {
        "address": "pluto@example.com",  // old email
        "verified": false
    }, ],
    "profile": {},
    "services": {
        "google": {
            "accessToken": "ya29.GAAaJ2JtofCXKEL364js7kzmQ",
            "expiresAt": 1400286604854,
            "id": "10489462794919007",
            "email": "topolino@example.com",  // new email
            "verified_email": true,
            "name": "Mr. Pippo Pippo",
            "given_name": "Pippo",
            "family_name": "Pippo",
            "picture": "https://lh3.googleusercontent.com/photo.jpg",
            "locale": "en_US",
            "gender": "male"
        },
        "password": {
            "srp": {
                "identity": "N30hYgzDlJz7i7nblcKdaPEfYsU8sfu3_g",
                "salt": "RoNU0BON_CZ31kE3mDD-tRK",
                "verifier": "4a7c3d"
            }
        },
        "resume": {
            "loginTokens": [{
                "when": "2014-05-16T23:20:59.417Z",
                "hashedToken": "t6y9di8Nws/b4sbh9E="
            }]
        }
    }
}


Tinytest.add("emails-field - accounts-password user", function(test) {
    var user;

    Meteor.users.remove({});
    Accounts.insertUserDoc({}, user1);
    // NO changes are expected into the `emails` field
    var expected_emails = [{
        address: "pippo@example.com",
        verified: false
    }]
    user = Meteor.users.findOne();
    updateEmails({
        user: user
    });
    user = Meteor.users.findOne();
    test.isTrue(_.isEqual(user.emails, expected_emails));

    Meteor.users.remove({});
    Accounts.insertUserDoc({}, user2);
    // NO changes are expected into the `emails` field
    var expected_emails = [{
        address: "pippo@example.com",
        verified: true
    }]
    user = Meteor.users.findOne();
    updateEmails({
        user: user
    });
    user = Meteor.users.findOne();
    test.isTrue(_.isEqual(user.emails, expected_emails));
});

Tinytest.add("emails-field - user from 3rd-party service", function(test) {
    var user;

    Meteor.users.remove({});
    Accounts.insertUserDoc({}, user3);
    // It is expected that the `emails` field be created adding the 3rd-party email
    var expected_emails = [{
        address: "pippo@best.com",
        verified: false
    }]
    user = Meteor.users.findOne();
    updateEmails({
        user: user
    });
    user = Meteor.users.findOne();
    test.isTrue(_.isEqual(user.emails, expected_emails));
});

Tinytest.add("emails-field - user from 3rd-party service with same (verified) password", function(test) {
    var user;

    Meteor.users.remove({});
    Accounts.insertUserDoc({}, user4);
    // It is expected that email inside `emails` remains but its verified status changes to true
    var expected_emails = [{
        address: "pippo@example.com",
        verified: true
    }]
    user = Meteor.users.findOne();
    updateEmails({
        user: user
    });
    user = Meteor.users.findOne();
    test.isTrue(_.isEqual(user.emails, expected_emails));
});

Tinytest.add("emails-field - user with accounts-password and updated password from 3rd-party service", function(test) {
    var user;

    Meteor.users.remove({});
    Accounts.insertUserDoc({}, user5);
    // It is expected that 3rd-party email inside `emails` be updated to the new address
    var expected_emails = [{
        address: "pippo@example.com",
        verified: false
    }, {
        address: "topolino@example.com", // new email
        verified: true
    }]
    user = Meteor.users.findOne();
    updateEmails({
        user: user
    });
    user = Meteor.users.findOne();
    test.isTrue(_.isEqual(user.emails, expected_emails));
});