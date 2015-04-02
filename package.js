Package.describe({
    summary: "Adds the `registered_emails` field to the user obj containing 3rd-party account service emails.",
    name: "splendido:accounts-emails-field",
    version: "1.0.3",
    git: "https://github.com/splendido/meteor-accounts-emails-field.git",
});

Package.on_use(function(api, where) {
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
    api.use('splendido:accounts-emails-field');
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
