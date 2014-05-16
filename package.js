Package.describe({
  summary: "REPLACEME - What does this package (or the original one you're wrapping) do?"
});

Package.on_use(function (api, where) {
  api.add_files('accounts-emails-field.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('accounts-emails-field');

  api.add_files('accounts-emails-field_tests.js', ['client', 'server']);
});
