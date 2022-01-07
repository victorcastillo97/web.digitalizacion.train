

document.addEventListener('alpine:init', () => {
    Alpine.store('reporte', {
        full: true,
    });
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

var json = {}
var total_items
var items_for_page=1

var item_start = 0
var item_fin = 0

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


function define_head_table(lista_head){
    let lista_thead = lista_head.slice()
    lista_thead.unshift("Nro.")
    lista_thead.push("Acción")

    let thead = document.createElement("tr");

    for (name_thead of lista_thead){

        let head_col = document.createElement("th");
        head_col.className = "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";
        head_col.textContent=name_thead

        thead.append(head_col) 
    }

    document.querySelector("#table > thead").append(thead);
}


function create_cell(text_cell){
    let cell = document.createElement("td")
    cell.className = "px-5 py-5 border-b border-gray-200 bg-white text-sm"
    
    //Creamos el texto de la celda
    let texto = document.createElement("p")
    texto.className = "text-gray-900 whitespace-no-wrap"
    texto.textContent = text_cell

    //Agregamos el texto a la celda
    cell.append(texto)

    return cell
}

function button_edit_delete(){
    let html_buttons = `
    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button class="edit_row text-sm text-white transition duration-150 rounded-l bg-blue-500 py-2 px-4">Editar</button>
        <button class="remove_row text-sm text-white transition duration-150 rounded-r bg-red-500 py-2 px-4"> Eliminar</button>
    </td>
    `
    return html_buttons
}


function define_body_table(lista_items,lista_key){
    document.querySelector("#table > tbody").innerHTML=""

    console.log("Definiendo: ",lista_items,item_start,item_fin)
    for (var i = item_start; i <= item_fin; i++) {
        let item = lista_items[i-1]
        console.log(item)
        //Creamos la fila
        let row = document.createElement("tr");

        //Agregamos la numeración a la primera celda
        row.append(create_cell(i))

        for (key of lista_key){
            //Creamos la celda
            let cell = create_cell(item[key])
            //Agregamos la celda a la fila
            row.append(cell)
        }

        //Agregamos los botones de edit y delete
        row.innerHTML += button_edit_delete() 

        //Agregamos la fila a la tabla
        document.querySelector("#table > tbody").append(row)

    }
}

//UPDATE TABLA
function update_table(){
    console.log("Update item inicio: ",item_start)
    total_items = json["items"].length

    item_fin = item_start +  total_items_watch_page(item_start,total_items,items_for_page) - 1

    show_state_table()
    update_style_buttons("next_table","previous_table")  

    //Registro datos en la tabla
    
    define_body_table(json["items"],json["keys"])

}


//INICIALIZAR TABLA
function init_table(json_table){
    Object.assign(json, json_table);
    console.log(json["items"])
    if (json["items"].length<=0){
        return false
    }

    item_start = 1
    define_head_table(json["keys"])
    update_table()
}

//EVENT CLICK BUTTON PREVIOUS
var button_previous = document.getElementById("previous_table");
button_previous.addEventListener("click",()=>{
    if (item_start>1){
        previous_items_start_fin(item_start,items_for_page,total_items)
        show_state_table()
        update_style_buttons("next_table","previous_table") 
        update_table(json)
    }
    
});

//EVENT CLICK BUTTON NEXT
var button_next = document.getElementById("next_table");
button_next.addEventListener("click",()=>{
    if (item_fin<total_items){
        next_items_start_fin(item_fin,items_for_page,total_items)
        show_state_table()
        update_style_buttons("next_table","previous_table") 
        update_table(json)
    }
    

});

json_destinatarios =  {1:[{'name': 'Victor', 'email': 'victor.castillo@protecso.com.pe'}, 
                {'name': 'John', 'email': 'john.montero@protecso.com.pe'}]}

function modal_html(row){
    lista_destinatarios = json_destinatarios[row]
    cantidad = lista_destinatarios.length

    for (datos of lista_destinatarios){
        let fila = document.createElement("tr")


        for (const [key, valor] of Object.entries(datos)) {
            let celda = document.createElement("td")
            celda.className = "px-5 py-5 border-b border-gray-200 bg-white text-sm"

            let texto  = document.createElement("p")
            texto.className = "text-gray-900 whitespace-no-wrap"
            texto.textContent = valor
            celda.append(texto)
            fila.append(celda)
            document.querySelector("#modal").append(fila)         }
        
    }
    

 
    
}

$(function() {
    $('tbody').sortable();

    $(document).on('click','.remove_row',function() {
        let row = item_start + $(this).parents('tr').index() - 1
        $(this).parents('tr').remove();
        //Eliminar de lista
        console.log("Borrando: ",json["items"][row])
        
        json["items"].splice(row, 1);
        
        update_table(json)
    })

    $(document).on('click','.edit_row',function() {
      let row = $(this).parents('tr').index() +1;
      modal_html(row)
      
    })

    $(document).on('click','#closeReporte',function() {
      document.querySelector("#modal").innerHTML=""
      
    })

    

    /*
     $('#getValues').click(function(){
        var values = [];
        $('input[name="name"]').each(function(i, elem){
            values.push($(elem).val());
        });
        alert(values.join(', '));
    });
    */

});


json_table = {"keys":["id","tipo","total"],"items":[{"id":"651513651","tipo":"Luz","total":"656.0"},{"id":"5454665","tipo":"Agua","total":"876.5"}]}
init_table(json_table)






