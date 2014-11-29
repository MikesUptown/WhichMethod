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
	# How old are you?
	# Please enter your age into the number keyboard.
	# -----
	it 'q1:q1_age should set implanon=-3 if age is 18 ...', ->
		prev = scope.ranking['implanon'].n;
		scope.questions.q1.answer = 18
		scope.questions.q1.ranking()
		expect(scope.ranking['implanon'].n).toBe (prev-3)

	it 'q1:q1_age should set nextQuestion = q2 ...', ->
		nextQ = scope.questions.q1.nextQuestion()
		expect(nextQ).toBe 'q2'

	# q2
	# How much do you weigh?
	# Please enter your weight in the number keyboard.
	# Please select either kilograms or pounds.
	# -----
	it 'q2:q3_weight should set ortho-evra=-2 if weight is 210 ...', ->
		prev = scope.ranking['ortho-evra'].n;
		scope.questions.q2.answer = 210
		scope.questions.q2.ranking()
		expect(scope.ranking['ortho-evra'].n).toBe (prev-2)

	it 'q2:q3_weight should set depo=-2, ortho-evra=-2 if weight is 260 ...', ->
		prevOrtho = scope.ranking['ortho-evra'].n;
		prevDepo = scope.ranking['depo'].n;
		scope.questions.q2.answer = 260
		scope.questions.q2.ranking()
		expect(scope.ranking['ortho-evra'].n).toBe (prevOrtho-2)
		expect(scope.ranking['depo'].n).toBe (prevDepo-2)

	it 'q2:q3_weight should set nextQuestion = q3 ...', ->
		nextQ = scope.questions.q2.nextQuestion()
		expect(nextQ).toBe 'q3'

	# q3
	# How often do you smoke cigarettes or cigars or use smokeless tobacco?
	# -----
	it 'q3:q7_smoke should set ocp=-999, ortho-evra=-999, nuvaring=-999 if answer is 3 and age > 30 ...', ->
		prevOcp = scope.ranking['ocp'].n;
		prevOrtho = scope.ranking['ortho-evra'].n;
		prevNuva = scope.ranking['nuvaring'].n;
		scope.questions.q3.answer = 3
		scope.questions.q1.answer = 36
		scope.questions.q3.ranking()
		expect(scope.ranking['ocp'].n).toBe (prevOcp-999)
		expect(scope.ranking['ortho-evra'].n).toBe (prevOrtho-999)
		expect(scope.ranking['nuvaring'].n).toBe (prevNuva-999)

	it 'q3:q7_smoke should set nextQuestion = q4 ...', ->
		nextQ = scope.questions.q3.nextQuestion()
		expect(nextQ).toBe 'q4'

	# q4
	# When you are not using birth control, do you have regular monthly periods?
	# -----
	it 'q4:q8_regularPeriod should set ocp=-999, nuvaring=-999 fam=-3 if answer is 0 ...', ->
		prevOcp = scope.ranking['ocp'].n;
		prevNuva = scope.ranking['nuvaring'].n;
		prevFam = scope.ranking['fam'].n;
		scope.questions.q4.answer = 0
		scope.questions.q4.ranking()
		expect(scope.ranking['ocp'].n).toBe (prevOcp-999)
		expect(scope.ranking['nuvaring'].n).toBe (prevNuva-999)
		expect(scope.ranking['fam'].n).toBe (prevFam-3)

	it 'q4:q8_regularPeriod should set nextQuestion = q5 if answer is not 0 ...', ->
		scope.questions.q4.answer = 1
		nextQ = scope.questions.q4.nextQuestion()
		expect(nextQ).toBe 'q5'

	it 'q4:q8_regularPeriod should set nextQuestion = q4a if answer is 0 ...', ->
		scope.questions.q4.answer = 0
		nextQ = scope.questions.q4.nextQuestion()
		expect(nextQ).toBe 'q4a'

	# q4a
	# Do you have three or fewer periods per year?
	# -----
	it 'q4a:q8a_periodFrequency should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, fam-=1, implanon+=1, if answer is 0 ...', ->
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

	it 'q4a:q8a_periodFrequency should set nextQuestion = q5 ...', ->
		nextQ = scope.questions.q4a.nextQuestion()
		expect(nextQ).toBe 'q5'

	# q5
	# When you are not using birth control, do you have very heavy periods?
	# -----
	it 'q5:q9_heavyPeriod should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, paragard-=2, if answer is 1 ...', ->
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

	it 'q5:q9_heavyPeriod should set nextQuestion = q6 ...', ->
		nextQ = scope.questions.q5.nextQuestion()
		expect(nextQ).toBe 'q6'

	# q6
	# When you are not using birth control, do you have periods that last longer than 7 days?
	# -----
	it 'q6:q10_period7days should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q6:q10_period7days should set nextQuestion = q7 ...', ->
		nextQ = scope.questions.q6.nextQuestion()
		expect(nextQ).toBe 'q7'

	# q7
	# When you are not using birth control, do you have painful periods or bad cramps?
	# -----
	it 'q7:q11_cramps should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, paragard-=2, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q7:q11_cramps should set nextQuestion = q7 ...', ->
		nextQ = scope.questions.q7.nextQuestion()
		expect(nextQ).toBe 'q8'


	# q8
	# When you are not using birth control, do you have breast tenderness during your period?
	# -----
	it 'q8:q12_tenderBreasts should set pop+=1, ortho-evra-=3, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q8:q12_tenderBreasts should set nextQuestion = q9 ...', ->
		nextQ = scope.questions.q8.nextQuestion()
		expect(nextQ).toBe 'q9'


	# q9
	# When you are not using birth control, do you have depression or anxiety during your period?
	# -----
	it 'q9:q13_depression should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q9:q13_depression should set nextQuestion = q10 ...', ->
		nextQ = scope.questions.q9.nextQuestion()
		expect(nextQ).toBe 'q10'


	# q10
	# When you are not using birth control, do you have bloating or fluid retention during your period?
	# -----
	it 'q10:q14_bloating should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q10:q14_bloating should set nextQuestion = q11 ...', ->
		nextQ = scope.questions.q10.nextQuestion()
		expect(nextQ).toBe 'q11'


	# q11
	# When you are not using birth control, do you have bad headaches with your period?
	# -----
	it 'q11:q15_headaches should set pop+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q11:q15_headaches should set nextQuestion = q12 ...', ->
		nextQ = scope.questions.q11.nextQuestion()
		expect(nextQ).toBe 'q12'


	# q12
	# When you are not using birth control, do you have significant PMS (premenstrual syndrome)?
	# -----
	it 'q12:q16_PMS should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
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

	it 'q12:q16_PMS should set nextQuestion = q13 ...', ->
		nextQ = scope.questions.q12.nextQuestion()
		expect(nextQ).toBe 'q13'


	# q13
	# How often do these symptoms cause you to miss work or school?
	# -----
	it 'q13:q17_missSchWork should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 1 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q13.answer = 1
		scope.questions.q13.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q13:q17_missSchWork should set ocp+=1, pop+=1, ortho-evra+=1, nuvaring+=1, depo+=1, mirena+=1, implanon+=1, if answer is 2 ...', ->
		prevOcp = scope.ranking['ocp'].p
		prevPop = scope.ranking['pop'].p
		prevOrtho = scope.ranking['ortho-evra'].p
		prevNuva = scope.ranking['nuvaring'].p
		prevDepo = scope.ranking['depo'].p
		prevMirena = scope.ranking['mirena'].p
		prevImplanon = scope.ranking['implanon'].p
		scope.questions.q13.answer = 2
		scope.questions.q13.ranking()
		expect(scope.ranking['ocp'].p).toBe (prevOcp + 1)
		expect(scope.ranking['pop'].p).toBe (prevPop + 1)
		expect(scope.ranking['ortho-evra'].p).toBe (prevOrtho + 1)
		expect(scope.ranking['nuvaring'].p).toBe (prevNuva + 1)
		expect(scope.ranking['depo'].p).toBe (prevDepo + 1)
		expect(scope.ranking['mirena'].p).toBe (prevMirena + 1)
		expect(scope.ranking['implanon'].p).toBe (prevImplanon + 1)

	it 'q13:q17_missSchWork should set nextQuestion = q14 ...', ->
		nextQ = scope.questions.q13.nextQuestion()
		expect(nextQ).toBe 'q14'


	# q14
	# How would you describe your current sexual relationship?
	# -----
	it 'q14:q18_SexualRel should set paragard-=1, mirena-=999, if answer is 2 ...', ->
		prevPara = scope.ranking['paragard'].n
		prevMirena = scope.ranking['mirena'].n
		scope.questions.q14.answer = 2
		scope.questions.q14.ranking()
		expect(scope.ranking['paragard'].n).toBe (prevPara - 1)
		expect(scope.ranking['mirena'].n).toBe (prevMirena - 999)

	it 'q14:q18_SexualRel should set nextQuestion = q15 ...', ->
		nextQ = scope.questions.q14.nextQuestion()
		expect(nextQ).toBe 'q15'


	# q15
	# During the last 12 months how many men, if any, have you had sexual intercourse with?
	# -----
	it 'q15:q19_vaginalSexCount should set paragard-=999, mirena-=999, if answer > 10 ...', ->
		prevPara = scope.ranking['paragard'].n
		prevMirena = scope.ranking['mirena'].n
		scope.questions.q15.answer = 15
		scope.questions.q15.ranking()
		expect(scope.ranking['paragard'].n).toBe (prevPara - 999)
		expect(scope.ranking['mirena'].n).toBe (prevMirena - 999)

	it 'q15:q19_vaginalSexCount should set nextQuestion = q16 ...', ->
		nextQ = scope.questions.q15.nextQuestion()
		expect(nextQ).toBe 'q16'
