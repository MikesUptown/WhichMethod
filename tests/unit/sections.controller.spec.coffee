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

	# q3
	# -----
	it 'q3: should set ocp=-999, ortho-evra=-999, nuvaring=-999 if answer is 3 and age > 30 ...', ->
		prevOcp = scope.ranking['ocp'].n;
		prevOrtho = scope.ranking['ortho-evra'].n;
		prevNuva = scope.ranking['nuvaring'].n;
		scope.questions.q3.answer = 3
		scope.questions.q1.answer = 36
		scope.questions.q3.ranking()
		expect(scope.ranking['ocp'].n).toBe (prevOcp-999)
		expect(scope.ranking['ortho-evra'].n).toBe (prevOrtho-999)
		expect(scope.ranking['nuvaring'].n).toBe (prevNuva-999)

	it 'q3: should set nextQuestion = q4 ...', ->
		nextQ = scope.questions.q3.nextQuestion()
		expect(nextQ).toBe 'q4'

	# q4
	# -----
	it 'q4: should set ocp=-999, nuvaring=-999 fam=-3 if answer is 0 ...', ->
		prevOcp = scope.ranking['ocp'].n;
		prevNuva = scope.ranking['nuvaring'].n;
		prevFam = scope.ranking['fam'].n;
		scope.questions.q4.answer = 0
		scope.questions.q4.ranking()
		expect(scope.ranking['ocp'].n).toBe (prevOcp-999)
		expect(scope.ranking['nuvaring'].n).toBe (prevNuva-999)
		expect(scope.ranking['fam'].n).toBe (prevFam-3)

	it 'q4: should set nextQuestion = q5 if answer is not 0 ...', ->
		scope.questions.q4.answer = 1
		nextQ = scope.questions.q4.nextQuestion()
		expect(nextQ).toBe 'q5'

	it 'q4: should set nextQuestion = q4a if answer is 0 ...', ->
		scope.questions.q4.answer = 0
		nextQ = scope.questions.q4.nextQuestion()
		expect(nextQ).toBe 'q4a'

	# q4a
	# -----
	it 'q4a: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, fam-=1, implanon+=1, if answer is 0 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevFam = scope.ranking['fam'].n
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q4a.answer = 0
		scope.questions.q4a.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['fam'].n).toBe (prevFam - 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'CHECK THIS! q4a: should set nextQuestion = q5 ...', ->
		nextQ = scope.questions.q4a.nextQuestion()
		expect(nextQ).toBe 'q5'

	# q5
	# -----
	it 'q5: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, paragard-=2, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		prevPara = scope.ranking['paragard'].n
		scope.questions.q5.answer = 1
		scope.questions.q5.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)
		expect(scope.ranking['paragard'].n).toBe (prevPara - 2)

	it 'q5: should set nextQuestion = q6 ...', ->
		nextQ = scope.questions.q5.nextQuestion()
		expect(nextQ).toBe 'q6'

	# q6
	# -----
	it 'q6: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q6.answer = 1
		scope.questions.q6.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q6: should set nextQuestion = q7 if answer = 0 ...', ->
		scope.questions.q6.answer = 0
		nextQ = scope.questions.q6.nextQuestion()
		expect(nextQ).toBe 'q7'

	it 'CHECK THIS! q6: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q6.answer = 1
		nextQ = scope.questions.q6.nextQuestion()
		expect(nextQ).toBe undefined


	# q7
	# -----
	it 'q7: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, paragard-=2, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevPara = scope.ranking['paragard'].n
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q7.answer = 1
		scope.questions.q7.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['paragard'].n).toBe (prevPara - 2)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q7: should set nextQuestion = q7 if answer = 0 ...', ->
		scope.questions.q7.answer = 0
		nextQ = scope.questions.q7.nextQuestion()
		expect(nextQ).toBe 'q8'

	it 'CHECK THIS! q7: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q7.answer = 1
		nextQ = scope.questions.q7.nextQuestion()
		expect(nextQ).toBe undefined


	# q8
	# -----
	it 'q8: should set pop+=1, ortho-evra-=3, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].n
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q8.answer = 1
		scope.questions.q8.ranking()
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].n).toBe (prevOrtho - 3)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q8: should set nextQuestion = q9 if answer = 0 ...', ->
		scope.questions.q8.answer = 0
		nextQ = scope.questions.q8.nextQuestion()
		expect(nextQ).toBe 'q9'

	it 'CHECK THIS! q8: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q8.answer = 1
		nextQ = scope.questions.q8.nextQuestion()
		expect(nextQ).toBe undefined


	# q9
	# -----
	it 'q9: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q9.answer = 1
		scope.questions.q9.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q9: should set nextQuestion = q10 if answer = 0 ...', ->
		scope.questions.q9.answer = 0
		nextQ = scope.questions.q9.nextQuestion()
		expect(nextQ).toBe 'q10'

	it 'CHECK THIS! q9: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q9.answer = 1
		nextQ = scope.questions.q9.nextQuestion()
		expect(nextQ).toBe undefined


	# q10
	# -----
	it 'q10: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q10.answer = 1
		scope.questions.q10.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q10: should set nextQuestion = q11 if answer = 0 ...', ->
		scope.questions.q10.answer = 0
		nextQ = scope.questions.q10.nextQuestion()
		expect(nextQ).toBe 'q11'

	it 'CHECK THIS! q10: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q10.answer = 1
		nextQ = scope.questions.q10.nextQuestion()
		expect(nextQ).toBe undefined


	# q11
	# -----
	it 'q11: should set pop+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevPop = scope.ranking['pop'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q11.answer = 1
		scope.questions.q11.ranking()
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q11: should set nextQuestion = q12 if answer = 0 ...', ->
		scope.questions.q11.answer = 0
		nextQ = scope.questions.q11.nextQuestion()
		expect(nextQ).toBe 'q12'

	it 'CHECK THIS! q11: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q11.answer = 1
		nextQ = scope.questions.q11.nextQuestion()
		expect(nextQ).toBe undefined


	# q12
	# -----
	it 'q12: should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q12.answer = 1
		scope.questions.q12.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q12: should set nextQuestion = q13 if answer = 0 ...', ->
		scope.questions.q12.answer = 0
		nextQ = scope.questions.q12.nextQuestion()
		expect(nextQ).toBe 'q13'

	it 'CHECK THIS! q12: should set nextQuestion = UNDEFINED if answer = 1 ...', ->
		scope.questions.q12.answer = 1
		nextQ = scope.questions.q12.nextQuestion()
		expect(nextQ).toBe undefined

