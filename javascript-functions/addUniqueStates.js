function addUniqueState(stateObject){
    const existingState = statesArray.find(state => state.name == stateObject.name)
    if(existingState){
        for(const county of stateObject.counties){
            existingState.counties.push(county);
        }
    } else {
        statesArray.push(stateObject);
    }
}