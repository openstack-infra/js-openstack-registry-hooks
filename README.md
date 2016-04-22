# openstack-registry-hooks
This project provides hooks necessary for the function of OpenStack's 
AFS-based NPM mirrors. It is maintained by OpenStack's Infrastructure team.

## Provided Hooks

#### indexJson
The official skimdb mirror (which we're supposed to use) contains older documents which do not match the SemVer specification. In order to ensure that the documents that we mirror match those available on registry.npmjs.org, this hook passes them through npm's `normalize-registry-metadata` package for sanitation.

#### afterAll
After each package is processed, the script will check the overall 
synchronization status of the mirror. If it detects that the mirror is up to 
date, it will exit the process.

This is done to ensure that the mirror is in a consistent state, before 
synchronizing the slave disk to the AFS Master. Resuming the process is 
handled via cron.

## QuickStart

	#!/bin/bash
	
	# Install the registry and the hook module.
	npm install -g registry-static openstack-registry-hooks
	
	# Run the registry script
	registry-static -d my.registry.com -o /var/www/registry \
		--hooks openstack-registry-hooks

## Some useful development commands

* `npm test` - Run all the tests, with coverage.
* `npm run lint` - Perform a linting check.

## Project Resources

  - [Source code](https://git.openstack.org/cgit/openstack/js-openstack-registry-hooks)
  - [How to contribute to OpenStack](http://docs.openstack.org/infra/manual/developers.html)
  - [Code review workflow](http://docs.openstack.org/infra/manual/developers.html#development-workflow)
  - IRC: \#openstack-infra on \#freenode
