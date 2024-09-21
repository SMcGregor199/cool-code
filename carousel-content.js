var exhibitEntries = document.getElementsByClassName("carousel-content-item");
var pageControllers = document.getElementsByClassName("content-carousel-page-controller");



function setupPagination() {
    const paginatedList = document.querySelector(".content-carousel-container");
    const pages = paginatedList.querySelectorAll('.content-carousel-page-controller');
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");
    let filtered = false;
    var visiblePageCount;
    const pageCount = pages.length;
    let currentPage = 1;
    
    const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    };
    const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };    
    
const handlePageButtonsStatus = () => {
    if(!filtered){
        if (currentPage === 1) {
          disableButton(prevButton);
        } else {
          enableButton(prevButton);
        }
    
        if (pageCount === currentPage) {
          disableButton(nextButton);
        } else {
          enableButton(nextButton);
        }
    } 
    else {
        const totalVisiblePages = calculateVisiblePages();
        if(currentPage === 1){
            disableButton(prevButton);
        }else {
            enableButton(prevButton);
        }
        if(currentPage === totalVisiblePages){
            disableButton(nextButton);
        } else {
            enableButton(nextButton);
        }
        
        // console.log(visiblePageCount);
        // if(visiblePageCount == 1){
        //     disableButton(prevButton);
        //     disableButton(nextButton);
        // }
        // else if(visiblePageCount > 1) {
        //     disableButton(prevButton);
        //     enableButton(nextButton);
        // }     
    }
};
        
const setCurrentPage = (pageNum,scroll) => {
    if(!filtered){
        currentPage = pageNum;
    }else {
        currentPage = Math.max(1, Math.min(pageNum, calculateVisiblePages()));
    }    
        handlePageButtonsStatus();
    
        pages.forEach((page, index) => {
          page.classList.add("hidden");
          if (index == pageNum-1) {
            page.classList.remove("hidden");
          }
        });
        
        if(scroll) document.getElementById('anchor-paginated-list').scrollIntoView();
    

};

     
    setCurrentPage(currentPage,false);
     
    prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1, true);
    });

    nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1, true);
    });
    
    document.addEventListener("change",function(event){
        if(event.target.id == "filter"){
            var selectedValue = document.getElementById("filter").value;
            if(selectedValue != "all exhibits"){
                   filterExhibits(pageControllers,selectedValue);
            }
            else {
                resetFilter(pageControllers);
            }
        } 
    });

    function extractYear(dateString){
        const dateObject = new Date(dateString);
        return dateObject.getFullYear();
    }


    function filterExhibits(list,filterValue) {
        
        for(const item of list){
            
            let hiddenSubItems = 0;
            for(const subItem of item.getElementsByClassName("carousel-content-item")){
                var exhibitsYear = extractYear(subItem.dataset.date);
                
                if(exhibitsYear != filterValue){
                    subItem.classList.add("hidden");   
                    hiddenSubItems++;
                }
                else {
                    subItem.classList.remove("hidden");
                    hiddenSubItems = 0;
                }
            }
            if(hiddenSubItems === item.getElementsByClassName("carousel-content-item").length){
                item.classList.add("hidden");
            } else {
                item.classList.remove("hidden");
            }
        }
        const visiblePages = Array.from(list).filter(function(page){
            return !page.classList.contains('hidden');
        })
        if(visiblePages.length>0){
            var firstVisiblePage = visiblePages[0];
            setCurrentPage(parseInt(firstVisiblePage.dataset.page),false);
            visiblePageCount = visiblePages.length;
            filtered=true;
            handlePageButtonsStatus();
        } else {
            console.log("handle scenario where no items are visible");
        }
    }


    function resetFilter(list){
        for(const item of list){
            if(item.dataset.page == 1){
                item.classList.remove("hidden")
                for(const subItem of item.getElementsByClassName("carousel-content-item")){
                    subItem.classList.remove("hidden");
                }
            }
            else {
                item.classList.add("hidden");
                for(const subItem of item.getElementsByClassName("carousel-content-item")){
                    subItem.classList.remove("hidden");
                }
                
            }
        }
        currentPage = 1;
        filtered = false;
        handlePageButtonsStatus();
    }
    
    function calculateVisiblePages() {
        const visiblePages = document.querySelectorAll('.content-carousel-page-controller:not(.hidden)');
        return visiblePages.length;
        
    }

    
}








/*
function textSearch() {
    var searcher = document.getElementById("possearch").value.toLowerCase();

    for(var item of pageControllers){
        let hasMatchingSubItem = false;
        for(var subItem of item.getElementsByClassName("carousel-content-item")){
        const searchTerms = subItem.dataset.keywords.toLowerCase();
            if (searchTerms.includes(searcher)) {
            subItem.classList.remove("hidden");
            hasMatchingSubItem = true;
            } else {
            subItem.classList.add("hidden");
            }
        }
        item.classList.toggle("hidden", !hasMatchingSubItem);
    }
   
}
*/

setupPagination();