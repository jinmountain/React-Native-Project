import checkUsernameFire from '../firebase/checkUsernameFire';

const meetUsernameRules = (possibleUsername, setRulesUsernameControl) => {
	let expr = /^[a-zA-Z0-9._]*$/;
	if 
	(
		!expr.test(possibleUsername) 
		// username must be longer than 4 characters
		|| possibleUsername.length < 5 
		// and less or equal to 30 characters
		|| possibleUsername.length > 30
	) {
		console.log('Username does not meet rules.')
		setRulesUsernameControl(false);
	} else {
		console.log('Username meets rules.')
		setRulesUsernameControl(true);
	}
};

const uniqueUsername = async (possibleUsername, currentUsername = null, setUniqueUsernameControl) => {
	if (possibleUsername != currentUsername ) {
		const check = await checkUsernameFire.checkUniqueUsername(possibleUsername);
		console.log('Username unique true or false? ', check);
		setUniqueUsernameControl(check);
	} else {
		setUniqueUsernameControl(false);
		console.log('False, same username as current');
	}
};

export { 
	meetUsernameRules, 
	uniqueUsername,
}