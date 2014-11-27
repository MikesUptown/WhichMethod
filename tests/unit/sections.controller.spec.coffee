'use strict'
 
#jasmine specs for controllers go here
 
describe 'Controller: SectionsCtrl', ->
	
	describe 'SectionsCtrl', ->

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
		    ));
		    console.log(JSON.stringify(scope.questions));
		    expect(1).toEqual 1

	# q1
	# -----
		it 'q1: should set implanon=-3 if age is 18 ...', ->
			prev = scope.ranking['implanon'].n;
			scope.questions.q1.answer = 18
			scope.questions.q1.ranking()
			expect(scope.ranking['implanon'].n).toBe (prev-3)

		it 'q1: should set nextQuestion = q2 ...', ->
			nextQ = scope.questions.q1.nextQuestion()
			expect(nextQ).toBe 'q2'

	# q2
	# -----
		it 'q2: should set ortho-evra=-2 if weight is 210 ...', ->
			prev = scope.ranking['ortho-evra'].n;
			scope.questions.q2.answer = 210
			scope.questions.q2.ranking()
			expect(scope.ranking['ortho-evra'].n).toBe (prev-2)

		it 'q2: should set depo=-2, ortho-evra=-2 if weight is 260 ...', ->
			prevOrtho = scope.ranking['ortho-evra'].n;
			prevDepo = scope.ranking['depo'].n;
			scope.questions.q2.answer = 260
			scope.questions.q2.ranking()
			expect(scope.ranking['ortho-evra'].n).toBe (prevOrtho-2)
			expect(scope.ranking['depo'].n).toBe (prevDepo-2)

		it 'q2: should set nextQuestion = q3 ...', ->
			nextQ = scope.questions.q2.nextQuestion()
			expect(nextQ).toBe 'q3'
