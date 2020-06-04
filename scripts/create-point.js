function getUfs(){
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {
        for(const state of states)
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
    })
}

getUfs();

function getCities(event){
    const citySelect = document.querySelector("select[name=cidade]");
    const inputEstado = document.querySelector("input[name=state]");

    citySelect.innerHTML = "<option value=''>Selecione uma cidade</option>";
    citySelect.disabled = true;

    inputEstado.value = event.target.options[event.target.selectedIndex].text;
    const UF = event.target.value;
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`
    fetch(url)
    .then( res => res.json() )
    .then( cities => {
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.id}">${city.nome}</option>`;
        }
        citySelect.disabled = false;
    })
}

function setSelectedCity(event){
    const inputCidade = document.querySelector("input[name=city]");
    inputCidade.value = event.target.options[event.target.selectedIndex].text;
}

 document.querySelector("select[name=uf]").addEventListener("change", getCities);
 document.querySelector("select[name=cidade]").addEventListener("change",setSelectedCity);

 //pegar todos os li
 const itemsToCollect = document.querySelectorAll(".items-grid li");
 
let selectedItems = [];
const collectedItems = document.querySelector("input[name=items]");

 function handleSelectedItem(event){
    const itemLi = event.target;
    itemLi.classList.toggle("selected");
    const itemId = event.target.dataset.id;

    const alreadySelected = selectedItems.findIndex(item=> item === itemId);

    if(alreadySelected != -1){
        let ItemsFiltrados = selectedItems.filter(item => {
            return item !=itemId;
        });
        selectedItems = ItemsFiltrados;
    }
    else{
       selectedItems.push(itemId);
    } 
    collectedItems.value = selectedItems;
    console.log(selectedItems);
 }

 for(const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem);
}

