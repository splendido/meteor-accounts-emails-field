Package.describe({
    summary: "Meteor package maintaining `registered_emails` field inside user objects.",
    version: "1.0.3",
    name: "splendido:accounts-emails-field",
    git: "https://github.com/splendido/meteor-accounts-emails-field.git"
});

Package.on_use(function(api, where) {
  api.versionsFrom("METEOR@0.9.0");
    api.use([
        'accounts-base',
        'underscore'
    ], ['server']);

    api.add_files([
        'lib/accounts-emails-field.js',
        'lib/accounts-emails-field-on-login.js'
    ], ['server']);

    api.imply([
        'accounts-base',
    ], ['server']);
});

Package.on_test(function(api) {
    api.use("splendido:accounts-emails-field");
    api.use([
        'tinytest',
        'test-helpers',
        'underscore'
    ], ['server']);
    api.add_files([
        'lib/accounts-emails-field.js',
        'tests/accounts-emails-field_tests.js'
    ], ['server']);
});