
Testing the questions
-----

Specify tests in files named ```<foo>.spec.js``` based on the Jasmine framework.

Use Karma as the test runner; Karma will drill into each directory looking
for spec files and executing the tests it finds. Karm is configured in the
file karm.conf.js in the project root directory.

To run the tests:

```bash
   cd ~/git/WhichMethod
   grunt karma
```

Results are stored in the karma_html directory and also in the jUnit format
in test-results.xml.


