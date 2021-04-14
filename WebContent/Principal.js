// Arquivo JS

var tabelaSel;
var campos = new Array();
var tbColuna = document.getElementById("tbColunas");
var row;
var codigo = 0;
var modal;

function selecionarTabela(tabela) {
	document.getElementById("selNome").innerHTML = tabela;
	this.tabelaSel = tabela;
	this.campos = getValores(tabela);
	out = "";
	this.campos.forEach(function (tab) {
		out = out + "<th>"+ tab[0] + "</th>\n";
	});
	out = out + "<th>Opções</th>\n";
	tbColuna.innerHTML = out;
	listar();
}

function listar() {
	//Limpar tabela
    var tab = document.getElementById("tabela");
    for(var i = tab.rows.length -1; i>0; i--) {
        tab.deleteRow(i);
    }
    
	fetch("http://localhost:8080/Futebol/Rest/" + this.tabelaSel.toLowerCase(), {method: "GET"})
    .then(Response => Response.json())
    .then(data => {
		if(data.condicao) {
			for(const item of data.resultado) {
				var tab = document.getElementById("tabela");
				this.row = tab.insertRow(-1);
				this.campos.forEach(function(val) {
					if(val[3] == "Tabela") {
						this.row.insertCell(-1).innerHTML = item[val[1].toLowerCase()][val[4][2]];
					} else {
						this.row.insertCell(-1).innerHTML = item[val[1].toLowerCase()];
					}
					
				})
				this.row.insertCell(-1).innerHTML = "<button type='button' class='btn btn-primary' onclick='alterar(" + item[campos[0][1]] + ")'>"
				+ "<i class='bi bi-pencil'></i></button>"
				+ "<button type='button' class='btn btn-danger' onclick='excluir(" + item[campos[0][1]] + ")'>"
				+ "<i class='bi bi-trash'></i></button>";
			}
		} else {
			alertify.error(data.mensagem);
		}
		
    })
}

function alterar(id) {
	createModal(this.tabelaSel);
	this.codigo = id;
	fetch("http://localhost:8080/Futebol/Rest/" + this.tabelaSel.toLowerCase() + "/" + id, {method: "GET"})
    .then(Response => Response.json())
    .then(data => {
		if(data.condicao) {
			this.campos.forEach(function(val) {
				if(!(val[1] == "codigo")) {
					if(val[3] == "Tabela") {
						document.getElementById(val[1]).value = JSON.stringify(data.resultado[val[1]]);
					} else {
						document.getElementById(val[1]).value = data.resultado[val[1]];
					}
				}
			})
		} else {
			alertify.error(data.mensagem);
			this.modal.hide();
		}
		
    })
}

function novo() {
	this.codigo = 0;
	createModal(this.tabelaSel);
}
var objJson = {}
function salvar() {
	this.modal = new bootstrap.Modal(document.getElementById('cadModal'), { keyboard: false });
	this.objJson = {};
	campos.forEach(function(val) {
		if(val[1] == campos[0][1]) {
			this.objJson[val[1]] = this.codigo;
		} else {
			if(val[3] == "Tabela") {
				this.objJson[val[1]] = JSON.parse(document.getElementById(val[1]).value);
			} else if(val[3] == "Int") {
				this.objJson[val[1]] = parseInt(document.getElementById(val[1]).value);
			} else if(val[3] == "Double") {
				this.objJson[val[1]] = parseFloat(document.getElementById(val[1]).value);
			} else {
				this.objJson[val[1]] = document.getElementById(val[1]).value;
			}
		}
	});
	
	var json = JSON.stringify(objJson);
    var url;
    var metodo;
    if(this.codigo == 0) {
        url = "http://localhost:8080/Futebol/Rest/" + this.tabelaSel.toLowerCase();
        metodo = "POST";
    } else {
        url = "http://localhost:8080/Futebol/Rest/"+ this.tabelaSel.toLowerCase() + "/" + this.codigo;
        metodo = "PUT";
    }

    fetch(url, {method: metodo, body: json})
    .then(response => response.json())
    .then(result => {
        if(result.condicao) {
			document.getElementById("btFechar").click();
			listar();
			alertify.success(result.mensagem);
        } else {
			alertify.error(result.mensagem);
		}
    })
}

function excluir(id) {
	valor = false;
	this.codigo = id;
	alertify.confirm("Tem certeza da exclusão ?",
		function(){ excluirSim(); }
	);
}

function excluirSim() {
	fetch("http://localhost:8080/Futebol/Rest/" + this.tabelaSel.toLowerCase() + "/" + this.codigo, {method: "DELETE"})
	.then(Response => Response.json())
	.then(data => {
		if(data.condicao) {
			alertify.success(data.mensagem);
			listar();
		} else {
			alertify.error(data.mensagem);
		}
	})
	this.codigo = 0;
}


function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].value == valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}