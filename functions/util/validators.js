const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(regEx) ? true : false;
}


const isEmpty = (string) => {
    return (string.trim() === '') ? true : false;
}

exports.validateLoginData = (user) => {
    let errors = {};

    if (isEmpty(user.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(user.email)) {
        errors.email = 'Must be a valid email address';
    }

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
    if (isEmpty(user.handle)) errors.handle = 'Must not be empty';


    return {
        errors,
        valid: Object.keys(errors).length === 0 && valid ? true : false
    };
}


exports.reduce_user_details = (data) => {
    let user_details = {};

    if (!isEmpty(data.bio.trim())) user_details.bio = data.bio;
    if (!isEmpty(data.website.trim())) {
        if (data.website.trim().substring(0, 4) !== 'http') {
            user_details.website = `https://${data.website.trim()}`;
        } else {
            user_details.website = data.website;
        }
    }
    if (!isEmpty(data.location.trim())) user_details.location = data.location;

    return user_details;
}