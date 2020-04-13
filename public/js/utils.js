const numberMonths = () => {
    
}

const sortBy = (data, sortParameter) => {
    _.sortBy(data, sortParameter);
    data.reverse();
    
    console.log(data);
    return data;
}