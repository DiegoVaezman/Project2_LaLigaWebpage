//LLAMADA A LA API

function getDataFetch(){
    displayLoader();
    const url = "https://api.football-data.org/v2/competitions/2014/matches";
    fetch(url, {
        method: "GET",
        headers: {
            "X-Auth-Token": "a9a0dfd78a8244f791860c965905d84f"
        }
    })
    .then(response => {
        if (response.ok);
        return response.json();
    })
    .then(data => {
        hideLoader();
        addOptions("datalist", teamList(data));
        resultTable(data);
    })
}



//ASIGNACIÓN DE FUNCIONES A BOTONES
document.addEventListener("DOMContentLoaded", function() {
    getDataFetch();
});
document.getElementById("searchbutton").addEventListener("click", function(e){
    e.preventDefault();  //evita que se recargue la página al filtrar por estar en formulario <form>los inputs de filtrado
    resultTable(getDataFetch());
})
document.getElementById("resetbutton").addEventListener("click", function(e){
    e.preventDefault();
    resetfilters();
    hideAlert();
})
document.getElementById("linkClose").addEventListener("click", function(){
    hideAlert();
});



//FUNCIÓN PARA OCULTAR LOADER
function displayLoader(){
    const loaderdiv = document.getElementById("loaderimg");
    loaderdiv.classList.add("display");
    //timeout???
}
//FUNCIÓN PARA MOSTRAR LOADER
function hideLoader(){
    const loaderdiv = document.getElementById("loaderimg");
    loaderdiv.classList.remove("display");
}




//FUNCIÓN PARA RESETEAR FORMULARIO DE FILTROS

function resetfilters(){
    document.getElementById("searchText").value = "";
    var radiobuttons = document.getElementsByName("resultado");
    for (value in radiobuttons){
        radiobuttons[value].checked = false;
    }
}


//FUNCIONES PARA MOSTRAR/OCULTAR ALERTA

function showAlert(){
    const alert = document.getElementById("alert");
    alert.style.display = "block";
}

function hideAlert(){
    const alert = document.getElementById("alert");
    alert.style.display ="none"}



//FUNCIÓN QUE CREA UNA ARRAY CON EL ID Y NOMBRE DE TODOS LOS EQUIPOS QUE HAY EN DATA

function teamList(data){
    var arrayEquipos = [];
    for (i=0;i<data.matches.length;i++){

        var hometeaminArray = arrayEquipos.find(equipo => equipo["id"] == data.matches[i].homeTeam.id);
        var awayteaminArray = arrayEquipos.find(equipo => equipo["id"] == data.matches[i].awayTeam.id);

        if (hometeaminArray == undefined){
            arrayEquipos.push({
                id: data.matches[i].homeTeam.id, 
                name: data.matches[i].homeTeam.name, 
            })
        }
        if (awayteaminArray == undefined){
            arrayEquipos.push({
                id:data.matches[i].awayTeam.id, 
                name:data.matches[i].awayTeam.name, 
            })
        }
    }
    return arrayEquipos
}


//FUNCIÓN QUE AGREGA OPTION TAGS EN HTML PARA EL DESPLEGABLE DEL INPUT "BUSCAR EQUIPO"

function addOptions(selectId, array){
    var select = document.getElementById(selectId);

    for (value in array){
        var option = document.createElement("option");
        option.text = array[value].name;
        select.append(option);
    }
}



//FUNCIÓN QUE FILTRA LA INFORMACIÓN DEL DOCUMENTO. DEVUELVE ARRAY FILTRADA. ESTA FUNCIÓN ES LLAMADA DENTRO DE LA FUNCIÓN tablaResultado()

function filters(data){

    //Creo/vacío la variable filteredTable y tomo referencias de elementos del html
    
    var filteredTable = [];
    var textInput = document.getElementById("searchText").value.toLowerCase();


    //Si no hay texto que buscar o "todos los partidos" la info será todo el doc y se deshabilitan dos radiobuttons.  Si hay texto me filtra con los nombres que contienen el texto.
    if (textInput == "" || textInput == "todos los equipos"){
        filteredTable = data.matches;
    }
    else {
        filteredTable = data.matches.filter(equipo => equipo.homeTeam.name.toLowerCase().includes(textInput) || equipo.awayTeam.name.toLowerCase().includes(textInput));
    }

    
     //Copruebo si hay un radiobutton seleccionado y filtro la array previa según el caso. Si no hay texto o "todos los partidos" salta alerta y la array será la previa (todo el doc).

    const radioganados = document.getElementById("ganados");
    const radioperdidos = document.getElementById("perdidos");
    const radioempatados = document.getElementById("empatados");
    const radiopendientes = document.getElementById("pendientes");
    
    const nothingToFilter = textInput == "" || textInput == "todos los equipos";
   
   

    if (radioganados.checked == true){
        if (nothingToFilter){showAlert();return filteredTable};
        filteredTable = filteredTable.filter(equipo => (equipo.homeTeam.name.toLowerCase().includes(textInput) && equipo.score.winner == "HOME_TEAM") || equipo.awayTeam.name.toLowerCase().includes(textInput) && equipo.score.winner == "AWAY_TEAM");
    }
    else if (radioperdidos.checked == true){
        if (nothingToFilter){showAlert();return filteredTable};
        filteredTable = filteredTable.filter(equipo => (equipo.homeTeam.name.toLowerCase().includes(textInput) && equipo.score.winner == "AWAY_TEAM") || equipo.awayTeam.name.toLowerCase().includes(textInput) && equipo.score.winner == "HOME_TEAM");
    }
    else if (radioempatados.checked == true){
        if (nothingToFilter){showAlert();return filteredTable};
        filteredTable = filteredTable.filter(equipo => equipo.score.winner == "DRAW");
    }
    else if (radiopendientes.checked == true){
        if (nothingToFilter){showAlert();return filteredTable};
        filteredTable = filteredTable.filter(equipo => equipo.status == "SCHEDULED");
    }

return filteredTable
}


//FUNCIÓN QUE CREA LA TABLA DE RESULTADOS A PARTIR DEL DOCUMENTO ORIGINAL. FILTRA LA INFORMACIÓN MEDIANTE LA FUNCIÓN filters()

function resultTable(data){

    //Vacío el contenido del tbody de la tabla
    document.getElementById("tablebody_resultados").innerHTML = "";


    //filtro el documento con la función filters y lo guardo en tableinfo
    var tableinfo = filters(data)
        

    //Obtengo referencia del elemento tbody
    var tbody = document.getElementById("tablebody_resultados");


    //Creo filas (tr) y las imagenes que irán en cada fila. Por ultimo meto las filas en tbody
    for (var i = 0; i < tableinfo.length; i++) {
        var fila = document.createElement("tr");

        var img1 = document.createElement("img");
        img1.src = "https://crests.football-data.org/" + tableinfo[i].homeTeam.id  + ".svg";
        img1.className = "imgTeam";
        
        var img2 = document.createElement("img");
        img2.src = "https://crests.football-data.org/" + tableinfo[i].awayTeam.id  + ".svg";
        img2.className = "imgTeam";



        // Creo cada celda con la información que deben contener
        for (var j = 0; j < 5; j++) {
            var celda = document.createElement("td");
            var textoCelda = "";
            if (j==0){
                textoCelda = document.createTextNode(tableinfo[i].utcDate.slice(0,10));
                celda.append(textoCelda);
            }
            if (j==1){
                textoCelda = document.createTextNode(tableinfo[i].homeTeam.name);
                celda.append(textoCelda);
                celda.append(img1);
            }
            if (j==2){
                textoCelda = document.createTextNode(tableinfo[i].score.fullTime.homeTeam + " - " + tableinfo[i].score.fullTime.awayTeam);
                if (tableinfo[i].score.fullTime.homeTeam == null){
                    textoCelda = document.createTextNode("Prox");
                }
                celda.append(textoCelda);
            }
            if (j==3){
                celda.append(img2);
                textoCelda = document.createTextNode(tableinfo[i].awayTeam.name);
                celda.append(textoCelda);
            }
            if (j==4){
                textoCelda = document.createTextNode(tableinfo[i].utcDate.slice(11,16));
                celda.append(textoCelda);
            }
            fila.append(celda);
        }
        tbody.append(fila);
    }
}



