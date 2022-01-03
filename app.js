

document.addEventListener('alpine:init', () => {

    Alpine.store('header', {
        full: false,
    });
    // Creating component Dropdown

    // Stores variable globally 
    Alpine.store('sidebar', {
        full: false,
        active: 'home',
        navOpen: false,
    });
    // Creating component Dropdown
    Alpine.data('dropdown', () => ({
        open: false,
        toggle(tab) {
            this.open = !this.open;
            Alpine.store('sidebar').active = tab;
        },
        activeClass: 'bg-gray-800 text-gray-200',
        expandedClass: 'border-l border-gray-400 ml-4 pl-4',
        shrinkedClass: 'sm:absolute top-0 left-20 sm:shadow-md sm:z-10 sm:bg-gray-900 sm:rounded-md sm:p-4 border-l sm:border-none border-gray-400 ml-4 pl-4 sm:ml-0 w-28'
    }));
    // Creating component Sub Dropdown
    Alpine.data('sub_dropdown', () => ({
        sub_open: false,
        sub_toggle() {
            this.sub_open = !this.sub_open;
        },
        sub_expandedClass: 'border-l border-gray-400 ml-4 pl-4',
        sub_shrinkedClass: 'sm:absolute top-0 left-28 sm:shadow-md sm:z-10 sm:bg-gray-900 sm:rounded-md sm:p-4 border-l sm:border-none border-gray-400 ml-4 pl-4 sm:ml-0 w-28'
    }));
    // Creating tooltip
    Alpine.data('tooltip', () => ({
        show: false,
        visibleClass:'block sm:absolute -top-7 sm:border border-gray-800 left-5 sm:text-sm sm:bg-gray-900 sm:px-2 sm:py-1 sm:rounded-md'
    }))
    
})


var total_items
var items_for_page

var item_start
var item_fin

var previous_active
var next_active

var cant_pages
var nro_page


function total_items_watch_page(item_start,total_items,items_for_page) {
    if (total_items - item_start < items_for_page){
        return total_items - item_start + 1 
    }
    else{
        return items_for_page
    }

}


function active_button_previous(item_start){
    if(item_start>1){
        return true
    }
    else{
        return false
    }
}

function active_button_next(item_fin,total_items){
    if(item_fin < total_items){
        return true
    }
    else{
        return false
    }    
}


//Actualiza botones al dar al boton siguiente
function next_items_start_fin(item_fin_actually,items_for_page,total_items){
    let item_start_next = item_fin_actually+1;
    let item_fin_next =item_start_next+ total_items_watch_page(item_start_next,total_items,items_for_page) - 1
    item_start = item_start_next
    item_fin = item_fin_next
    
    
}

//Actualiza botones al dar al boton anterior
function previous_items_start_fin(item_start_actually,items_for_page,total_items) {
    let item_start_previous
    let item_fin_previous = item_start_actually-1

    if (item_fin_previous-items_for_page<0){
        item_start_previous = 1
        item_fin_previous = total_items_watch_page(item_start_previous,total_items,items_for_page)
    }
    else{
        item_start_previous = item_fin_previous-items_for_page + 1
    }

    item_start = item_start_previous
    item_fin = item_fin_previous
}

//Actualiza al cambiar los items por pagina
function update_items_for_page(item_start_actually,items_for_page_update,total_items){
    items_for_page = items_for_page_update

    let item_start_update = item_start_actually;
    let item_fin_update = item_start_update+ total_items_watch_page(item_start_update,total_items,items_for_page) - 1

    item_start = item_start_update
    item_fin = item_fin_update

}

//Muestra en la parte inferior de la tabla en que parte de la tabla nos encontramos
function show_state_table(){
    var state_table = document.getElementById("state-show-table");
    
    state_table.innerText = "Presentando desde "+ item_start +" a "+ item_fin + " de " + total_items + " elementos."
}


function update_style_buttons(css_button_next,css_button_previous){
    next_active = active_button_next(item_fin,total_items)
    button_next = document.getElementById(css_button_next)
    if (next_active){
        button_next.classList.toggle("bg-gray-600",true)
        button_next.classList.toggle("hover:bg-gray-500",true)
        
    }else{
        button_next.classList.toggle("bg-gray-600",false)
        button_next.classList.toggle("hover:bg-gray-500",false)
    }

    previous_active = active_button_previous(item_start)
    button_previous = document.getElementById(css_button_previous)
    if (previous_active){
        button_previous.classList.toggle("bg-gray-600",true)
        button_previous.classList.toggle("hover:bg-gray-500",true)
    }else{
        button_previous.classList.toggle("bg-gray-600",false)
        button_previous.classList.toggle("hover:bg-gray-500",false)
    }
    
}




//INICIALIZAR PAGINA
function init(cantidad_items){
    total_items = cantidad_items
    items_for_page = 10

    if (cantidad_items>0){
        item_start = 1
        item_fin = total_items_watch_page(item_start,total_items,items_for_page)
    }else
    {
        item_start = 0
        item_fin = 0
    }
    
    previous_active = false
    next_active = active_button_next(item_fin,total_items)

    show_state_table()

    update_style_buttons("next_table","previous_table")  

    initialization = true


}





//EVENT PREVIOUS
var button_previous = document.getElementById("previous_table");
button_previous.addEventListener("click",()=>{
    if (item_start>1){
        previous_items_start_fin(item_start,items_for_page,total_items)
        show_state_table()
        update_style_buttons("next_table","previous_table") 
    }
    
        

});

//EVENT NEXT
var button_next = document.getElementById("next_table");
button_next.addEventListener("click",()=>{
    if (item_fin<total_items){
        next_items_start_fin(item_fin,items_for_page,total_items)
        show_state_table()
        update_style_buttons("next_table","previous_table") 
    }
    

});





init(7)






