const addBox = document.querySelector(".add-caixa"),
popupCaixa = document.querySelector(".popup-caixa"),
popupTitulo = popupCaixa.querySelector("header p"),
fecharIcone = popupCaixa.querySelector("header i"),
titleTag = popupCaixa.querySelector("input"),
descTag = popupCaixa.querySelector("textarea"),
addBtn = popupCaixa.querySelector("button");

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
              "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const notas = JSON.parse(localStorage.getItem("notas") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitulo.innerText = "Adicionar uma nova nota";
    addBtn.innerText = "Adicionar Nota";
    popupCaixa.classList.add("mostrar");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

fecharIcone.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupCaixa.classList.remove("mostrar");
    document.querySelector("body").style.overflow = "auto";
});

function mostrarNotas() {
    if(!notas) return;
    document.querySelectorAll(".nota").forEach(li => li.remove());
    notas.forEach((nota, id) => {
        let filterDesc = nota.descricao.replaceAll("\n", '<br/>');
        let liTag = `<li class="nota">
                        <div class="detalhes">
                            <p>${nota.titulo}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="conteudo-abaixo">
                            <span>${nota.data}</span>
                            <div class="config">
                                <i onclick="mostrarMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="atualizarNota(${id}, '${nota.titulo}', '${filterDesc}')"><i class="uil uil-pen"></i>Editar</li>
                                    <li onclick="deletarNota(${id})"><i class="uil uil-trash"></i>Deletar</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
mostrarNotas();

function mostrarMenu(elem) {
    elem.parentElement.classList.add("mostrar");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("mostrar");
        }
    });
}

function deletarNota(notaId) {
    let confirmDel = confirm("Tem certeza de que deseja excluir esta anotação?");
    if(!confirmDel) return;
    notas.splice(notaId, 1);
    localStorage.setItem("notas", JSON.stringify(notas));
    mostrarNotas();
}

function atualizarNota(notaId, titulo, filterDesc) {
    let descricao = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = notaId;
    isUpdate = true;
    addBox.click();
    titleTag.value = titulo;
    descTag.value = descricao;
    popupTitulo.innerText = "Atualizar Anotação";
    addBtn.innerText = "Atualizar Nota";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let titulo = titleTag.value.trim(),
    descricao = descTag.value.trim();

    if(titulo || descricao) {
        let currentDate = new Date(),
        mes = meses[currentDate.getMonth()],
        dia = currentDate.getDate(),
        ano = currentDate.getFullYear();

        let notaInfo = {titulo, descricao, data: `${mes} ${dia}, ${ano}`}
        if(!isUpdate) {
            notas.push(notaInfo);
        } else {
            isUpdate = false;
            notas[updateId] = notaInfo;
        }
        localStorage.setItem("notas", JSON.stringify(notas));
        mostrarNotas();
        fecharIcone.click();
    }
});