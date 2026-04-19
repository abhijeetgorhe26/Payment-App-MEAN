const generateOtp = () => {
    let length = 6;
    let character = '0123456789';

    let otp = '';

    for (let i = 0; i < length; i++) {
        let getRandomIdx = Math.floor(Math.random() * character.length);
        otp += character[getRandomIdx];
    }

    return otp;
}


export default generateOtp;