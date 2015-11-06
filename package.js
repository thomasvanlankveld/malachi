Package.describe({
  name: 'thomasvanlankveld:malachi',
  version: '0.1.0',
  summary: 'Tiny event dispatcher factory for javascript DDD applications',
  git: 'https://github.com/thomasvanlankveld/malachi',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'underscore'
  ]);
  api.addFiles('malachi.js');
  api.export('malachi');
});

//Package.onTest(function(api) {
//  api.use('ecmascript');
//  api.use('tinytest');
//  api.use('thomasvanlankveld:malachi');
//  api.addFiles('malachi-tests.js');
//});
