#set($menuId = $ContentIdentifier)
#set($thisMenuWidget = $dotcontent.find($ContentIdentifier))
#set($uniqueStates = [])


## $thisMenuWidget.optionData
    
#foreach($person in $thisMenuWidget.optionData.keySet())
    #foreach($stateObject in $thisMenuWidget.optionData.get($person).keySet())
        #if(!$uniqueStates.contains($stateObject))
            #set($dummy = $uniqueStates.add($stateObject))
        #end
    #end
#end

<select class="base-menu" id="a-${menuId}">
    <option value="">--Filter By State--</option>
    #foreach($state in $uniqueStates)
    <option value="$state.toLowerCase()">$state</option>
    #end
</select>






#set($meetTheAdmissionsTeam = $dotcontent.find($dotContentMap.displayedContent.identifier))
 #set($d = $meetTheAdmissionsTeam.departmentLister.selectedValues)
#foreach($dept in $d )
    #set($departmentLister = $departmentLister+",$dept")
#end

#dotParse("${dotTheme.path}velocity/widgets/staff-widget.vtl")


<script>
var facultyMembers = Array.from(document.getElementsByClassName("faculty-member"));
facultyMembers.forEach(function(element){
    element.style.display = "none";
})
var statesArray = [];

function StateObject(name,counties){
    this.name = name;
    this.counties = counties;
}

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
                        console.log("the menu already exist");
                        for(var county of item.counties){
                            optionsHtml += `<option value="${county.toLowerCase()}">${county}</option>`;
                        }
                        console.log(secondSelectMenu);
                        secondSelectMenu.insertAdjacentHTML("beforeend",optionsHtml);
                    }

                } else {
                    console.log("The list of counties is empty. Here we do a search");
                }
            }

        }
    } 
});

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

function dotCMSStringToJSON(inputString) {

let jsonString = inputString.replace(/=/g, ':');


jsonString = jsonString.replace(/({|}|,\s*)(\w+)(\s*:)/g, '$1"$2"$3');


jsonString = jsonString.replace(/(\w+)(:\[)/g, '"$1"$2');


jsonString = jsonString.replace(/(\[|\s*)([\w\s]+)(\s*\]|,\s*)/g, '$1"$2"$3');


    try {
        let jsonObject = JSON.parse(jsonString);
        return jsonObject;
        } 
    catch (error) {
        console.error('Error parsing JSON:', error);
        return null; 
        }
}
</script>







## <select class="base-menu" id="b-${menuId}" style="display:none">
##     <option value="">--Filter By County--</option>
## </select>

## $thisMenuWidget.optionData.get($person).get($stateObject)
## <span style="color:red;">$stateObject</span> The state
        ## <span style="color:blue;"> 
        ##     $thisMenuWidget.optionData.get($person).get($stateObject)</span> the counties array