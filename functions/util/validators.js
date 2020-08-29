

const isEmpty = (string) => {
    return (string.trim() === '') ? true : false;
}

exports.validateLoginData = (user) => {
    let errors = {};

    if (isEmpty(user.email)) errors.email = 'Must not be empty';
    if (isEmpty(user.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}

exports.validateSignupData = (user) => {
    let { errors, valid } = this.validateLoginData(user);

    if (isEmpty(user.password)) errors.password = 'Must not be empty';
    if (user.password !== user.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (isEmpty(user.userHandle)) errors.handle = 'Must not be empty';


    return {
        errors,
        valid: Object.keys(errors).length === 0 && valid ? true : false
    };
}