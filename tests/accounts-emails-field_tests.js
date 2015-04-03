/* global AccountsEmailsField: false */
'use strict';


// User from accounts-password service with one non-verified
// email inside `emails` field
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
};

// User from accounts-password service with one verified
// email inside `emails` field
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
};

Tinytest.add("emails-field - accounts-password user", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user1);
	// NO changes are expected into the `emails` field and `registered_emails`
	// should result equal to `emails`
	var expectedRegisteredEmails = [{
		address: "pippo@example.com",
		verified: false
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.emails, expectedRegisteredEmails));
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));

	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user2);
	// NO changes are expected into the `emails` field and `registered_emails`
	// should result equal to `emails`
	expectedRegisteredEmails = [{
		address: "pippo@example.com",
		verified: true
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.emails, expectedRegisteredEmails));
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
});


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
};

Tinytest.add("emails-field - user from 3rd-party service", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user3);
	// It is expected that the `registered_emails` field
	// be created with the 3rd-party email
	var expectedRegisteredEmails = [{
		address: "pippo@best.com",
		verified: true
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
	// No field `emails` should be created!
	test.isUndefined(user.emails);
});


// User from accounts-password service with one non verified email inside
// `emails` field plus a 3rd-party service using the same email, but verified
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
};

Tinytest.add("emails-field - user from 3rd-party service with same (verified) email", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user4);
	// It is expected that email inside `emails` remains unchanged but
	// its verified status changes to true inside `registered_emails`
	var emails = [{
		address: "pippo@example.com",
		verified: false
	}];
	var expectedRegisteredEmails = [{
		address: "pippo@example.com",
		verified: true
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.emails, emails));
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
});


// User from accounts-password service with one non verified email inside
// `emails` field plus a 3rd-party service using another email which was changed
// after the last login
var user5 = {
	"emails": [{
		"address": "pippo@example.com",
		"verified": false
	}],
	"registered_emails": [{
		"address": "pippo@example.com",
		"verified": false
	}, {
		"address": "pluto@example.com", // old email
		"verified": false
	}, ],
	"profile": {},
	"services": {
		"google": {
			"accessToken": "ya29.GAAaJ2JtofCXKEL364js7kzmQ",
			"expiresAt": 1400286604854,
			"id": "10489462794919007",
			"email": "topolino@example.com", // new email
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
};

Tinytest.add("emails-field - user with accounts-password and updated password from 3rd-party service", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user5);
	// It is expected that 3rd-party email inside `registered_emails` be updated
	// to the new address
	var expectedRegisteredEmails = [{
		address: "pippo@example.com",
		verified: false
	}, {
		address: "topolino@example.com", // new email
		verified: true
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
});


// GitHub login does not assure verified email!!!
var user6 = {
	"profile": {},
	"services": {
		"github": {
			"id": 7829990,
			"accessToken": "a49d3c9aedb73b739bc8042c5fe9ce26b49e5a7e",
			"email": "maiemai@gmail.com",
			"username": "maiemai"
		}
	}
};

Tinytest.add("emails-field - login with github: email not verified by default!", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user6);
	// It is expected that the registered email is marked as non-verified!
	var expectedRegisteredEmails = [{
		address: "maiemai@gmail.com",
		verified: false
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
});


// Twitter provides no email!!!
var user7 = {
	"profile": {},
	"services": {
		"twitter": {
			"id": 7829990,
			"accessToken": "a49d3c9aedb73b739bc8042c5fe9ce26b49e5a7e",
		}
	}
};

Tinytest.add("emails-field - no email addresses!", function(test) {
	var user;
	Meteor.users.remove({});
	// Users 7 uses twitter as the login service
	// (which provides no email field...)
	Accounts.insertUserDoc({}, user7);
	// It is expected that the registered email is not defined!
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isUndefined(user.emails);
	test.isUndefined(user.registered_emails);

	// Checks `registered_emails` be removed after update
	var registeredEmails = [{
		address: "pippo@example.com",
		verified: false
	}, {
		address: "topolino@example.com", // new email
		verified: true
	}];
	Meteor.users.update({
		_id: user._id
	}, {
		$set: {
			registered_emails: registeredEmails
		}
	});

	// It is expected that the registered email is not defined!
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isUndefined(user.emails);
	test.isUndefined(user.registered_emails);
});



// Meteor login has arrays of emails
var user8 = {
	"profile": {
		"username": "meteorUser",
	},
	"services": {
		"meteor-developer": {
			"accessToken": "iR2sZihFeZ5drH3QT",
			"expiresAt": NaN,
			"username": "example_user",
			"emails": [{
				"address": "user@example.com",
				"primary": true,
				"verified": true
			}, {
				"address": "user@another.com",
				"primary": false,
				"verified": false
			}],
			"id": "acgHB2qTSZZueAdGG"
		},
	}
};

Tinytest.add("emails-field - login with meteor: multiple emails", function(test) {
	var user;
	Meteor.users.remove({});
	Accounts.insertUserDoc({}, user8);
	// It is expected that the registered email is marked as non-verified!
	var expectedRegisteredEmails = [{
		address: "user@example.com",
		verified: true
	}, {
		address: "user@another.com",
		verified: false
	}];
	user = Meteor.users.findOne();
	AccountsEmailsField.updateEmails({
		user: user
	});
	user = Meteor.users.findOne();
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails));
});

Tinytest.add("emails-field - updateAllUsersEmails", function(test) {
	Meteor.users.remove({});

	Accounts.insertUserDoc({}, user1);
	Accounts.insertUserDoc({}, user3);
	Accounts.insertUserDoc({}, user8);
	var expectedRegisteredEmails1 = [{
		address: "pippo@example.com",
		verified: false
	}];
	var expectedRegisteredEmails3 = [{
		address: "pippo@best.com",
		verified: true
	}];
	var expectedRegisteredEmails8 = [{
		address: "user@example.com",
		verified: true
	}, {
		address: "user@another.com",
		verified: false
	}];

	AccountsEmailsField.updateAllUsersEmails();

	var user;

	// Verify that user1 was correctly updated
	user = Meteor.users.findOne({
		"emails.address": "pippo@example.com"
	});
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails1));

	// Verify that user3 was correctly updated
	user = Meteor.users.findOne({
		"profile.headline": "Super Pippo"
	});
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails3));

	// Verify that user8 was correctly updated
	user = Meteor.users.findOne({
		"profile.username": "meteorUser"
	});
	test.isTrue(_.isEqual(user.registered_emails, expectedRegisteredEmails8));
});
