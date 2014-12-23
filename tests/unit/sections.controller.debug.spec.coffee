#
# Coffeescript is EXTREMELY sensitive to whitespace
# Use TAB
# Set tab to 4 spaces
#

'use strict'

describe 'Controller: SectionsCtrl', ->
	
	# setup - all tests
	# -----
	beforeEach module 'contraceptionApp'

	ctrl = undefined
	scope = undefined

	beforeEach inject ($controller, $rootScope) ->
		scope = $rootScope.$new();
		ctrl = $controller 'SectionsCtrl', {
			$scope: scope
		}

	# debug
	# -----
	it 'debug: should print scope in debug console log ...', ->
		seen = [];
		console.log(
			JSON.stringify(scope, (key, val) ->
				if (val != null && typeof val == "object")
					if (seen.indexOf(val) >= 0)
						return
					seen.push(val)
				return val
			)
		);
		console.log(JSON.stringify(scope.questions));
		expect(1).toEqual 1

