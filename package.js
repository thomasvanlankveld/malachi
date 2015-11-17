Package.describe({
  name: 'thomasvanlankveld:malachi',
  version: '0.2.0',
  summary: 'Tiny event dispatcher factory for JavaScript DDD applications',
  git: 'https://github.com/thomasvanlankveld/malachi',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript@0.1.5');
  api.addFiles('malachi.js');
  api.export('malachi');
});

Package.onTest(function(api) {

  /**
   * Both
   */
  api.use([
    'ecmascript',
    'sanjo:jasmine@0.20.2',
    'thomasvanlankveld:malachi'
  ], ['client', 'server']);
  api.addFiles([
    'tests/both/malachi-spec.js'
  ], ['client', 'server']);
});
