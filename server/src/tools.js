export const  isEmail = (email) =>{
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email);
}

export const reverse = (data) => {
    let newString = "";
    for (var i = data.length - 1; i >= 0; i--) {
        newString += data[i];
    }
    return newString;
}

export const reverseArray = (data) => {
    let newArray = [];
    for (var i = data.length - 1; i >= 0; i--) {
        newArray.push(data[i]);
    }
    return newArray;
}