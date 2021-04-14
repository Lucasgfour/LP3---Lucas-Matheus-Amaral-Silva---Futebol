// JS destinado a cuidar do Modal


function createModal(tabela) {
	var dados = getValores(tabela);
	var html = "";
	dados.forEach(function(campo){
		html = html + createCampo(campo);
	});
	
	document.getElementById('modalTitulo').innerHTML = tabela;
	document.getElementById('modalConteudo').innerHTML = html;

	dados.forEach(function(campo) {
		if(campo[3] == "Tabela") {
			SubTabela(campo[1], campo[4]);
		}
	});

	var modal = new bootstrap.Modal(document.getElementById('cadModal'), { keyboard: false });
	modal.show();
}

function createCampo(campo) {
	if(campo[2] == false && campo[3] == "Text") {
		return '<div class="input-group mb-3">\n' +
		  '<span class="input-group-text" id="Lb' + campo[1] + '">' + campo[0] + '</span>\n' +
		  '<input type="text" class="form-control" aria-label="Lb' + campo[1] + '" id="' + campo[1] + '">\n' +
		'</div>';
	} else if(campo[2] == false && campo[3] == "Tabela") {
		return '<div class="input-group mb-3">\n' +
			'<span class="input-group-text" id="Lb' + campo[1] + '">' + campo[0] + '</span>\n' +
			'<select class="form-select form-select-sm" id="' + campo[1] + '" aria-label=".form-select-sm example">\n' + 
		 	'</select>\n' +
		'</div>';
	} else if(campo[2] == false && (campo[3] == "Double" || campo[3] == "Int")) {
		return '<div class="input-group mb-3">\n' +
		  '<span class="input-group-text" id="Lb' + campo[1] + '">' + campo[0] + '</span>\n' +
		  '<input type="number" class="form-control" aria-label="Lb' + campo[1] + '" id="' + campo[1] + '">\n' +
		'</div>';
	} else {
		return "";
	}
}

// Nome, nomeBanco, Oculto, Tipo[Text,Tabela], VinculoATabela[nomeTabela, valor, innerHTML]
function getValores(tabela) {

	if(tabela == "Time") {
		return	 [  ["Código" , "codigo" , true , "Int"  , []],
					["Nome"   , "nome"   , false, "Text"  , []],
					["Estádio", "estadio", false, "Tabela", ["estadio", "codigo", "nome"]],
					["Serie"  , "serie"  , false, "Text"  , []] ];
	} else if(tabela == "Jogador") {
		return	 [  ["Código" , "codigo"  , true , "Int"  , []],
					["Nome"   , "nome"    , false, "Text", []],
					["Time"   , "time"    , false, "Tabela", ["time", "codigo", "nome"]],
					["Salario", "salario" , false, "Double", ["time", "codigo", "nome"]]];
	} else if(tabela == "Estadio") {
		return	 [  ["Código" , "codigo"  , true , "Int" , []],
					["Nome"   , "nome"    , false, "Text", []],
					["Cidade" , "cidade"  , false, "Text", []]];
	}
}

var objSubTab;
var objCampo;
function SubTabela(nomeObjeto, campo) {
	this.objSubTab = nomeObjeto;
	this.objCampo = campo;

	fetch("http://localhost:8080/Futebol/Rest/" + this.objCampo[0], {method: "GET"})
    .then(Response => Response.json())
    .then(data => {
		if(data.condicao) {
			select = document.getElementById(this.objSubTab);
			for(const item of data.resultado) {
				let newOption = new Option(item[this.objCampo[2]], JSON.stringify(item));
				select.add(newOption,undefined);
			}
		} else {
			alertify.error(data.mensagem);
		}
    })
}