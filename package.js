Package.describe({
    summary: "This package maintains the `emails` array field inside the user object up to date with any 3rd-party account service email used by the user to login into the application."
});

Package.on_use(function(api, where) {
    api.use([
        'accounts-base',
        'underscore'
    ], ['server']);

    api.add_files([
        'accounts-emails-field.js'
    ], ['server']);

    api.imply([
        'accounts-base',
    ], ['server']);
});

Package.on_test(function(api) {
    api.use('accounts-emails-field');
    api.use([
        'tinytest',
        'test-helpers',
        'underscore'
    ], ['server']);
    api.add_files([
        'accounts-emails-field_tests.js'
    ], ['server']);
});