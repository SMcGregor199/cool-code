document.addEventListener("change",function(event){
    
    if(event.target.id == "a-${menuId}"){
        
        // creating all the variables I need
        var firstSelectMenu = document.getElementById("a-${menuId}");    
        var filterByState = document.getElementById("a-${menuId}").value.toLowerCase(); 
        var jsonObject = dotCMSStringToJSON('$thisMenuWidget.optionData');
        var secondSelectMenu = document.createElement("select");
        secondSelectMenu.classList.add("base-menu");
        secondSelectMenu.setAttribute("id","b-${menuId}");
        var secondSelectMenuChecker = document.querySelector("#b-${menuId}");
        secondSelectMenu.innerHTML = `<option value="">--Filter By County--</option>`;
        //End of variable creation 
        
        // looping through the JSON to create a new usable list called statesArray
        for(var personId in jsonObject){
            var personData = jsonObject[personId];
           
            for (var state in personData){
                var counties = personData[state];
                var stateObject = new StateObject(state,personData[state]);
                addUniqueState(stateObject);
            }
        }
        //End of JSON loop
        
        // Logic that determines the options of the select menu
        for(item of statesArray){
            // if there's a match continue (there should always be a match)
            if(item.name.toLowerCase() == filterByState){
                // If the state has a real array of counties continue
                if(item.counties[0] != "Entire State" ){
                    var optionsHtml = ""; 
                    // if the second select menu doesn't already exist
                    if(!secondSelectMenuChecker){
                    // loop through the list of counties and store it in optionsHtml    
                        for(var county of item.counties){
                            optionsHtml += `<option value="${county.toLowerCase()}">${county}</option>`;
                        }
                        // insert options into second select menu
                        secondSelectMenu.insertAdjacentHTML("beforeend",optionsHtml);
                        // add second select menu to web page
                        firstSelectMenu.insertAdjacentElement("afterend",secondSelectMenu);                        
                    }
                    else {
                        console.log("The second select menu already exist");
                    }

                } else {
                    console.log("The list of counties is empty. Here we do a search");
                }
            }

        }
    } 
});