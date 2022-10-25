var usuarioAdm;

//GRAFICOS
function GraficoAdmIndex(n1,n2,n3,n4){
    
    if(typeof(document.getElementById("myChart")) != 'undefined' && document.getElementById("myChart") != null){
        document.getElementById("myChart").remove()
    } 

    var divCanvas = document.createElement("canvas");
    divCanvas.setAttribute("id","myChart");

    var divGrafico = document.getElementById('divGrafico');
    divGrafico.appendChild(divCanvas);

    const ctx = divCanvas;
    const myChart = new Chart(ctx, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: ['Hr.Ex 50%', 'Hr.Ex 100%', 'Hr.Ex Not 50%', 'Hr.Ex Not 100%'],
            datasets: [{
                label: 'Horas',
                data: [Math.round10(n1, -1), Math.round10(n2, -1), Math.round10(n3, -1), Math.round10(n4, -1)],
                backgroundColor: [
                    'rgba(255, 88, 6, 0.8)',
                    'rgba(4, 58, 56, 0.8)',
                    'rgba(119, 119, 117, 0.8)',
                    'rgba(42, 42, 42, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 88, 6, 1)',
                    'rgba(4, 58, 56, 1)',
                    'rgba(119, 119, 117, 1)',
                    'rgba(42, 42, 42, 1)',
                ],
                borderWidth: 2
            }]
        }, 
        options: {
            plugins:{
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    offset: 4,
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }


        }
        

    });
    
}

//----------------------------------------------------------------------------------------------------------
//                                          CHAMADA DOS RELATÓRIOS
//----------------------------------------------------------------------------------------------------------

function RelatorioAssinatura(){
    var DataInicial = document.getElementById('txtDataInicial').value
    var DataFinal = document.getElementById('txtDataFinal').value

    window.location.href = '/relatorioAssinatura/' + DataInicial + '/' + DataFinal
    
}

function RelatorioCheque(){
    var DataInicial = document.getElementById('txtDataInicial').value
    var DataFinal = document.getElementById('txtDataFinal').value

    window.location.href = '/cheque/' + DataInicial + '/' + DataFinal
    
}

function RelatorioLiquido(){
    var DataInicial = document.getElementById('txtDataInicial').value
    var DataFinal = document.getElementById('txtDataFinal').value

    window.location.href = '/liquido/' + DataInicial + '/' + DataFinal
    
}

function RelatorioAssinaturaInd(){

    var funcionario = document.getElementById('selectFuncionarios')
    var matricula = funcionario.getElementsByTagName('option')[funcionario.selectedIndex].value

    var DataInicial = document.getElementById('txtDataInicial').value
    var DataFinal = document.getElementById('txtDataFinal').value

    window.location.href = '/relatorioAssinaturaInd/' + matricula + '/' + DataInicial + '/' + DataFinal
    
}

function RelatorioTotalFuncionarios(){

    var funcionario = document.getElementById('selectFuncionarios')
    var matricula = funcionario.getElementsByTagName('option')[funcionario.selectedIndex].value

    var DataInicial = document.getElementById('txtDataInicial').value
    var DataFinal = document.getElementById('txtDataFinal').value

    window.location.href = 'report/totalfuncionario/' //+ matricula + '/' + DataInicial + '/' + DataFinal

}

//----------------------------------------------------------------------------------------------------------

var verificarAdministrador = async function () {

	var postResp = await fetch('/permissao');
	var post = await postResp.json();
    return post;

};

async function loadIndex(){
    usuarioAdm = await verificarAdministrador();
    SetDataInicial();
    carregarFuncionarios();
}

function dataFormatada(data){
    var dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

function difference(date1, date2) {  
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      day = 1000*60*60*24;
    return(date2utc - date1utc)/day
  }


function validaPeriodo(dataIni,dataFim) {

    // if(dataIni.getDate() + 1 !== 22){
    //     alert("ATENÇÃO, A DATA INICIAL SEMPRE DEVE SER O DIA 22 DO MÊS");
    //     SetDataInicial();
    // }else if (dataFim.getDate() + 1 !== 21) {
    //     alert('ATENÇÃO! A DATA FINAL SEMPRE DEVE SER DIA 21 DO MÊS POSTERIOR DA DATA INICIAL');
    //     SetDataInicial();
    // } else if ((dataIni.getMonth() + 1) < 12 && ((dataFim.getMonth() + 1) - (dataIni.getMonth() + 1)) !== 1) {
    //     alert('PERÍODO INVÁLIDO, A DIFERENÇA DE DATAS NÃO PODE SER MAIOR QUE 1 MÊS');
    //     SetDataInicial();
    // } else if((dataIni.getMonth() + 1) == 12){
    //     if((dataFim.getMonth() + 1) > 1){
    //         alert('PERÍODO INVÁLIDO, A DIFERENÇA DE DATAS NÃO PODE SER MAIOR QUE 1 MÊS');
    //         SetDataInicial();
    //     }
    // }
}

function SetDataInicial() {

    const dataAtual = new Date();
    var dataInicial = [];
    var dataFinal = [];
  
    //ANO INICIAL
    if (dataAtual.getMonth() == 0 && dataAtual.getDate() < 22) dataInicial.push(dataAtual.getFullYear()-1) 
    else dataInicial.push(dataAtual.getFullYear())
  
    //MÊS INICIAL
    if (dataAtual.getMonth() == 0 && dataAtual.getDate() < 22) dataInicial.push(11)
    else if(dataAtual.getDate() < 22) dataInicial.push(dataAtual.getMonth()-1)
    else dataInicial.push(dataAtual.getMonth())
  
    //DIA INICIAL
    dataInicial.push(22)
  
    //alert(dataInicial)
  
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
    //ANO FINAL
    if (dataAtual.getMonth() == 11 && dataAtual.getDate() > 21) dataFinal.push(dataAtual.getFullYear()+1) 
    else dataFinal.push(dataAtual.getFullYear())
  
    //MÊS FINAL
    if (dataInicial[1] == 11) dataFinal.push(0)
    else dataFinal.push(dataInicial[1] + 1)
  
    //DIA FINAL
    dataFinal.push('21')
  
    //alert(dataFinal)
  
    document.getElementById("txtDataInicial").value = dataInicial[0].toString() + '-' +  ("00" + (dataInicial[1] + 1)).slice(-2).toString() + '-' + dataInicial[2].toString()
    document.getElementById("txtDataFinal").value = dataFinal[0].toString() + '-' +  ("00" + (dataFinal[1] + 1)).slice(-2).toString() + '-' + dataFinal[2].toString()

    tableCreate();
}

// TABELA DINAMICA
async function tableCreate(){
    
    // DEFININDO AS DATAS
    var dt1 = new Date(document.getElementById("txtDataInicial").value);
    var dt2 = new Date(document.getElementById("txtDataFinal").value);

    time_difference = difference(dt1,dt2)
    
    try {
        validaPeriodo(dt1,dt2);
    } catch (error) {
        alert(error);
        alert("A PÁGINA SERÁ RECARREGADA");
        document.location.reload(true);
    }

    var element = document.getElementById("divtabponto");
    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
        //alert('Element exists');
        element.remove()
    } else{
        //alert('Element does not exist');
    }

    // CRIANDO A TABELA
    var body = document.body;

    var divTab = document.createElement("div");
    divTab.setAttribute("id","divtabponto");
    divTab.classList.add("table-responsive");

    body.appendChild(divTab);

    var tbl = document.createElement('table');
    tbl.setAttribute("id","tabelamarcacao");
    tbl.classList.add('table');

    divTab.appendChild(tbl);

    // CONSTRUIR O CABEÇALHO DA TABELA
    var tblHead = document.createElement('thead');

    tbl.appendChild(tblHead);

    if(usuarioAdm){
        var cabecalhoTable = ["Data","Entrada 1","Saída 1","Entrada 2","Saída 2","H.Ex 50%","H.Ex 100%","H.Ex Not. 50%","H.Ex Not. 100%","VT","Motivo","Ações"];
    }else{
        var cabecalhoTable = ["Data","Entrada 1","Saída 1","Entrada 2","Saída 2","Motivo","Ações"];
    }

    tblHead.classList.add("header")
    

    for(var i=0;i < cabecalhoTable.length;i++){
        tblHead.appendChild(document.createElement("th")).
        appendChild(document.createTextNode(cabecalhoTable[i]));            
    }

    //CONSTRUIR O TBODY
    var tblBody = document.createElement("tbody");
    tblBody.classList.add("content");
    tbl.appendChild(tblBody);

    // INSERIR AS LINHAS DA TABELA
    for(var linha = 0; linha <= time_difference; linha++){
        
        var tr = tbl.insertRow();

        //DATA
        var td = tr.insertCell();
        
        var incrementoData = dt1;
        incrementoData.setDate(incrementoData.getDate() + 1);

        tr.setAttribute("value",dataFormatada(incrementoData));
        //tr.setAttribute("id",dataFormatada(incrementoData) + '-tbl');

        // var date = pontos.DATA 
        // date.setDate(date.getDate() + 1);  
        var diaSemana = 0  

        if (incrementoData.getDay() === 0) { 
            diaSemana = ' - Dom'  
        } 

        if (incrementoData.getDay() === 1) { 
            diaSemana = ' - Seg'  
        } 

        if (incrementoData.getDay() === 2) { 
            diaSemana = ' - Ter'  
        } 

        if (incrementoData.getDay() === 3) { 
            diaSemana = ' - Qua'  
        } 

        if (incrementoData.getDay() === 4) { 
            diaSemana = ' - Qui'  
        } 

        if (incrementoData.getDay() === 5) { 
            diaSemana = ' - Sex'  
        } 

        if (incrementoData.getDay() === 6) { 
            diaSemana = ' - Sab'  
        }     

        td.appendChild(document.createTextNode(dataFormatada(incrementoData) + diaSemana)); //+ diaSemana
        
        //ENTRADA 1
        var td = tr.insertCell();

        var entrada1 = document.createElement("input");
        entrada1.setAttribute("type","time");
        entrada1.setAttribute("name","entrada1");

        td.appendChild(entrada1);

        //SAIDA 1
        var td = tr.insertCell();

        var saida1 = document.createElement("input");
        saida1.setAttribute("type","time");
        saida1.setAttribute("name","saida1");

        td.appendChild(saida1);

        //ENTRADA 2
        var td = tr.insertCell();

        var entrada2 = document.createElement("input");
        entrada2.setAttribute("type","time");
        entrada2.setAttribute("name","entrada2");

        td.appendChild(entrada2);

        //SAIDA 2
        var td = tr.insertCell();

        var saida2 = document.createElement("input");
        saida2.setAttribute("type","time");
        saida2.setAttribute("name","saida2");

        td.appendChild(saida2);

        //INCLUI COLUNAS DE HORA EXTRA SE O USUARIO FOR ADMINISTRADOR

        if(usuarioAdm){

            //HORA EXTRA NORMAL 50%
            var td = tr.insertCell();

            //HORA EXTRA NORMAL 100%
            var td = tr.insertCell();

            //HORA EXTRA NOTURNA 50%
            var td = tr.insertCell();

            //HORA EXTRA NOTURNA 100%
            var td = tr.insertCell();

            //VALE TRANSPORTE
            var td = tr.insertCell();
            var vt = document.createElement("input");
            vt.setAttribute("type","checkbox");
            vt.setAttribute("name","vt");
            td.appendChild(vt);
        }

        //MOTIVO
        var td = tr.insertCell();

        var motivo = document.createElement('textarea');
        motivo.classList.add("form-control");
        motivo.setAttribute("rows",1);
        motivo.setAttribute("name","motivo");

        td.appendChild(motivo);

        //AÇÕES
        var td = tr.insertCell();

        var btnGroup = document.createElement("div");
        btnGroup.classList.add("btn-group")
        
        td.appendChild(btnGroup)

        var btn1 = document.createElement("button");
        btn1.classList.add("btn");
        btn1.classList.add("btn-primary");
        btn1.setAttribute("type","button");
        btn1.setAttribute("id",dataFormatada(incrementoData));
        btn1.setAttribute("onclick","lancarMarcacao(this.id)");
        btn1.appendChild(document.createTextNode("Lançar"));

        btnGroup.appendChild(btn1);

        if(usuarioAdm){

            var btn2 = document.createElement("button");
            btn2.classList.add("btn");
            btn2.classList.add("btn-danger");
            btn2.setAttribute("type","button");
            btn2.setAttribute("id",dataFormatada(incrementoData));
            btn2.setAttribute("onclick","excluirMarcacao(this.id)");
            btn2.appendChild(document.createTextNode("Excluir")); 

            btnGroup.appendChild(btn2);

            var btn3 = document.createElement("button");
            btn3.classList.add("btn");
            btn3.classList.add("btn-dark");
            btn3.setAttribute("type","button");
            btn3.setAttribute("id",dataFormatada(incrementoData));
            btn3.setAttribute("onclick","desbloquearMarcacao(this.id)");
            btn3.appendChild(document.createTextNode("Desbloquear")); 

            btnGroup.appendChild(btn3);

        }

    }

    body.appendChild(divTab);

    //ATUALIZAR MARCAÇÕES SE HOUVER UM FUNCIONÁRIO SELECIONADO
    var SelectFunc = document.getElementById('selectFuncionarios');
    if(SelectFunc.length > 0){
        var Func = SelectFunc.getElementsByTagName('option')[SelectFunc.selectedIndex];
        if (Func.text != '---') {
            atualizarMarcacoes();
        }
    }

}


function carregarFuncionarios(){
    let dropdown = document.getElementById('selectFuncionarios');
    dropdown.length = 0;
    
    let defaultOption = document.createElement('option');
    defaultOption.text = '---';
    
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    
    const url = '/funcionarios';
    
    fetch(url)  
      .then(  
        function(response) {  
          if (response.status !== 200) {  
            console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
            return;  
          }
    
          // Examine the text in the response  
          response.json().then(function(data) {  
            let option;
        
            for (let i = 0; i < data.length; i++) {
              option = document.createElement('option');
                option.text = data[i].NOME;
                option.value = data[i].MATRICULA;
                dropdown.add(option);
            }    
          });  
        }  
      )  
      .catch(function(err) {  
        console.error('Fetch Error -', err);  
      });
}

function atualizarMarcacoes(){

    try {

        var select = document.getElementById('selectFuncionarios');
        var matricula = select.options[select.selectedIndex].value;

        var DataInicial = document.getElementById('txtDataInicial').value;
        var DataFinal = document.getElementById('txtDataFinal').value;
   
        //PREENCHER O TABLE
        //divtabponto
        //tabelamarcacao
        var tabela = document.getElementById("tabelamarcacao");
        
        var inputTime;

        var hora1 = 0.00;
        var hora2 = 0.00;
        var hora3 = 0.00;
        var hora4 = 0.00;
   
       //LOOP NO ARRAY DE MARCAÇÕES
       const url = '/marcacoes/' + matricula + '/' + DataInicial + '/' + DataFinal;
       
       fetch(url).then(function(response) {  
             if (response.status !== 200) {  
               console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
               return;  
             }            

            // Examine the text in the response  
            response.json().then(function(data){

                if(data.length <= 0){
                    limparTabela();
                    return;
                } 
                
                var rows = tabela.getElementsByTagName('tr');

                for(let r = 0;r <= rows.length; r++){

                    for (let i = 0; i < data.length; i++) {

                        var dataMarcacao = String(data[i].DATA).substring(8,10) + '/' + String(data[i].DATA).substring(5,7) + '/' + String(data[i].DATA).substring(0,4);
                        var DataTabela = rows[r].getAttribute("value")

                        // if (DataTabela == dataMarcacao) alert('igual')

                        if (DataTabela == dataMarcacao){

                            // alert('entrou')
                            rows[r].getElementsByTagName('td')[0].setAttribute('id',data[i].ID);

                           //ENTRADA1
                           var inputEntrada1 = rows[r].getElementsByTagName('td')[1].getElementsByTagName('input')[0];
                           inputEntrada1.value = String(data[i].ENTRADA1).substring(11,16);

                           //SAIDA1
                           var inputSaida1 = rows[r].getElementsByTagName('td')[2].getElementsByTagName('input')[0];
                           inputSaida1.value = String(data[i].SAIDA1).substring(11,16);

                           //ENTRADA2
                           var inputEntrada2 = rows[r].getElementsByTagName('td')[3].getElementsByTagName('input')[0];
                           inputEntrada2.value = String(data[i].ENTRADA2).substring(11,16);

                           //SAIDA2
                           var inputSaida2 = rows[r].getElementsByTagName('td')[4].getElementsByTagName('input')[0];
                           inputSaida2.value = String(data[i].SAIDA2).substring(11,16);
                           
                           if(usuarioAdm){

                                rows[r].getElementsByTagName('td')[5].textContent = Math.round10(data[i].HEX1/60, -1);
                                rows[r].getElementsByTagName('td')[6].textContent = Math.round10(data[i].HEX2/60, -1);
                                rows[r].getElementsByTagName('td')[7].textContent = Math.round10(data[i].HEXN1/60, -1);
                                rows[r].getElementsByTagName('td')[8].textContent = Math.round10(data[i].HEXN2/60, -1);

                                rows[r].getElementsByTagName('td')[5].setAttribute('style','text-align: center;');
                                rows[r].getElementsByTagName('td')[6].setAttribute('style','text-align: center;');
                                rows[r].getElementsByTagName('td')[7].setAttribute('style','text-align: center;');
                                rows[r].getElementsByTagName('td')[8].setAttribute('style','text-align: center;');

                                //VALE TRANSPOSRTE
                                var inputVT = rows[r].getElementsByTagName('td')[9].getElementsByTagName('input')[0];
                                inputVT.checked = data[i].VT
                                //if(data[i].VT == 1) inputVT.checked = true

                                //MOTIVO
                                var inputMotivo = rows[r].getElementsByTagName('td')[10].getElementsByTagName('textarea')[0];
                                inputMotivo.value = data[i].OBSERVACAO;

                            }else{
                                //MOTIVO
                                var inputMotivo = rows[r].getElementsByTagName('td')[5].getElementsByTagName('textarea')[0];
                                inputMotivo.value = data[i].OBSERVACAO;
                            }


                            hora1 = hora1 + data[i].HEX1/60;
                            hora2 = hora2 + data[i].HEX2/60;
                            hora3 = hora3 + data[i].HEXN1/60;
                            hora4 = hora4 + data[i].HEXN2/60;

                            break

                        }else{

                            rows[r].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
                            rows[r].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value = "";
                            rows[r].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = "";
                            rows[r].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = "";

                            if(usuarioAdm){
                                rows[r].getElementsByTagName('td')[5].textContent = ""
                                rows[r].getElementsByTagName('td')[6].textContent = ""
                                rows[r].getElementsByTagName('td')[7].textContent = ""
                                rows[r].getElementsByTagName('td')[8].textContent = ""
                                rows[r].getElementsByTagName('td')[9].getElementsByTagName('input')[0].checked = false;
                                rows[r].getElementsByTagName('td')[10].getElementsByTagName('textarea')[0].value = "";
                                
                            }else{
                                rows[r].getElementsByTagName('td')[5].getElementsByTagName('textarea')[0].value = "";
                            }
                        }
                    }

                    if(r == rows.length -1) {
                        GraficoAdmIndex(hora1,hora2,hora3,hora4)
                    }
                }
             });
        })

        .catch(function(err) {  
           console.error('Fetch Error -', err);  
         });

    } catch (error) {
        console.log(error)
    }

    
}

function limparTabela(){

    document.getElementById("myChart").remove()

    var tabela = document.getElementById("divtabponto");
    var linTab = tabela.getElementsByTagName('tr');

    for(let r = 0;r <= linTab.length; r++){

        linTab[r].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
        linTab[r].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value = "";
        linTab[r].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = "";
        linTab[r].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = "";

        if(usuarioAdm){
            linTab[r].getElementsByTagName('td')[5].textContent = "";
            linTab[r].getElementsByTagName('td')[6].textContent = "";
            linTab[r].getElementsByTagName('td')[7].textContent = "";
            linTab[r].getElementsByTagName('td')[8].textContent = "";
            linTab[r].getElementsByTagName('td')[9].checked = false;
            linTab[r].getElementsByTagName('td')[10].getElementsByTagName('textarea')[0].value = "";

        }else{
            linTab[r].getElementsByTagName('td')[5].getElementsByTagName('textarea')[0].value = "";
        }

    }
}

function lancarMarcacao(idButton){

    var SelectFunc = document.getElementById('selectFuncionarios');
    var Func = SelectFunc.getElementsByTagName('option')[SelectFunc.selectedIndex];


    //CAPTURAR AS VARIÁVEIS PARA A INCLUSÃO NO BANCO
    var funcionario = Func.value //MATRICULA
    var dia = idButton;

    //CAPTURAR LANÇAMENTOS DO DIA DO BOTÃO SELECIONADO
    var tabela = document.getElementById("divtabponto");
    var rows = tabela.getElementsByTagName('tr');
    var inputVT = 0
    
    for(let r = 0;r <= rows.length; r++){
        
        //var DataLinha = rows[r].getElementsByTagName('td')[0].textContent.split('-')
        var DataLinha = rows[r].getAttribute("value")
        if (DataLinha == dia){
            var inputEntrada1 = rows[r].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value; //ENTRADA1
            var inputSaida1 = rows[r].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value; //SAIDA1
            var inputEntrada2 = rows[r].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value; //ENTRADA2
            var inputSaida2 = rows[r].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value; //SAIDA2
            if(usuarioAdm){
                if(rows[r].getElementsByTagName('td')[9].getElementsByTagName('input')[0].checked) inputVT = 1
                var inputMotivo = rows[r].getElementsByTagName('td')[10].getElementsByTagName('textarea')[0].value; //MOTIVO
            }else{
                var inputMotivo = rows[r].getElementsByTagName('td')[5].getElementsByTagName('textarea')[0].value; //MOTIVO
            }
            break
        }
    }

    dia = dia.substring(6,10) + '-' + dia.substring(3,5) + '-' + dia.substring(0,2);

    //REALIZAR AS VALIDAÇÕES PARA EXECUTAR O POST

    //PRECISA SELECIONAR UM FUNCIONÁRIO VÁLIDO
    if (Func.text === '---') {
        alert ('ESTE FUNCIONÁRIO NÃO É VÁLIDO');
        loadIndex();
        return;
    }

    //VALIDA SE MOTIVO FOI PREENCHIDO
    if(inputMotivo == ''){ 
        alert('O CAMPO MOTIVO É OBRIGATÓRIO');
        return;
    }

    //VERIFICA SE A SAIDA1 É > QUE A ENTRADA 1
    // if(inputSaida1 != '' && (inputSaida1 <= inputEntrada1)){
    //     alert ('A SAÍDA 1 NÃO PODE SER ANTERIOR OU IGUAL A ENTRADA 1');
    //     return;
    // }

    // //VERIFICA SE A ENTRADA 2 É > QUE A SAIDA 1 1
    // if( inputEntrada2 != '' && (inputEntrada2 < inputSaida1 || inputEntrada2 < inputEntrada1)) {
    //     alert ('A ENTRADA 2 NÃO PODE SER ANTERIOR A SAIDA OU ENTRADA 1');
    //     return;
    // }

    // //VERIFICA SE A ENTRADA 2 É > QUE A ENTRADA1
    // if(inputSaida2 != '' && (inputSaida2 < inputEntrada2 || inputSaida2 < inputSaida1 || inputSaida2 < inputEntrada1)){
    //     alert ('A SAIDA 2 NÃO PODE SER ANTERIOR A BATIDAS ANTECESSORES');
    //     return;
    // }

    //INSERIR NO BANCO
    var url = '/lancarMarcacao'

    //MANDANDO POST DE CRIAÇÃO DE LANÇAMENTO PARA O SERVIDOR
    var xhr = new XMLHttpRequest();
    try {

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                switch(xhr.responseText) {
                    case 'INSERT - SUCESS':
                        alert('MARCAÇAO INSERIDA COM SUCESSO');
                        document.getElementById(idButton).classList.remove('btn-primary');
                        document.getElementById(idButton).classList.add('btn');
                        document.getElementById(idButton).classList.add('btn-success');
                        break;
                    case 'INSERT - FAIL':
                        alert ('A MARCAÇÃO NÃO PODE SER INSERIDA, ATUALIZE A PÁGINA E TENTE NOVAMENTE');
                        document.getElementById(idButton).classList.remove('btn-primary');
                        document.getElementById(idButton).classList.add('btn');
                        document.getElementById(idButton).classList.add('btn-danger');
                        break;
                    case 'UPDATE - SUCESS':
                        alert('MARCAÇAO ATUALIZADA COM SUCESSO');
                        document.getElementById(idButton).classList.remove('btn-primary');
                        document.getElementById(idButton).classList.add('btn');
                        document.getElementById(idButton).classList.add('btn-success');
                        break;
                    case 'UPDATE - FAIL':
                        alert ('A MARCAÇÃO NÃO PODE SER ATUALIZADA, ATUALIZE A PÁGINA E TENTE NOVAMENTE');
                        document.getElementById(idButton).classList.remove('btn-primary');
                        document.getElementById(idButton).classList.add('btn');
                        document.getElementById(idButton).classList.add('btn-danger');
                        break;
                    case 'BLOQUEADO':
                        alert ('A MARCAÇÃO ESTÁ BLOQUEADA, SOLICITE LIBERAÇÃO DA ADM. PESSOAL');
                        document.getElementById(idButton).classList.remove('btn-primary');
                        document.getElementById(idButton).classList.add('btn');
                        document.getElementById(idButton).classList.add('btn-dark');
                        break;
                    default:
                      alert (xhr.responseText);
                      break;
                  }
            }
        }

            var data = {
                matricula: funcionario,
                dia: dia,
                entrada1: inputEntrada1,
                saida1: inputSaida1,
                entrada2: inputEntrada2,
                saida2: inputSaida2,
                vt: inputVT,
                motivo: inputMotivo 
            }

        xhr.send(JSON.stringify(data));

    } catch (error) {
        alert(error);
        loadIndex();
        return
    }

}

//-----------------------------------------------------------------------------
//EXLUIR MARCAÇÃO--------------------------------------------------------------
//-----------------------------------------------------------------------------

function excluirMarcacao(idButton){

    var SelectFunc = document.getElementById('selectFuncionarios');
    var Func = SelectFunc.getElementsByTagName('option')[SelectFunc.selectedIndex];

    //CAPTURAR AS VARIÁVEIS PARA A EXCLUSÃO NO BANCO
    var funcionario = Func.value //MATRICULA
    var dia = idButton;

    dia = dia.substring(6,10) + '-' + dia.substring(3,5) + '-' + dia.substring(0,2);    

    //PRECISA SELECIONAR UM FUNCIONÁRIO VÁLIDO
    if (Func.text === '---') {
        alert ('ESTE FUNCIONÁRIO NÃO É VÁLIDO');
        loadIndex();
        return;
    }

    //INSERIR NO BANCO
    var url = '/excluirMarcacao'

    //MANDANDO POST DE CRIAÇÃO DE LANÇAMENTO PARA O SERVIDOR
    var xhr = new XMLHttpRequest();
    try {

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                switch(xhr.responseText) {
                    case 'DELETE - SUCESS':
                        alert('MARCAÇAO EXCLUIDA COM SUCESSO');
                        tableCreate();
                        break;
                    case 'DELETE - FAIL':
                        alert ('A MARCAÇÃO NÃO PODE SER EXCLUIDA, ATUALIZE A PÁGINA E TENTE NOVAMENTE');
                        tableCreate()
                        break;
                    default:
                      alert (xhr.responseText);
                      break;
                  }
            }
        }
            var data = {
                matricula: funcionario,
                dia: dia
            }

        xhr.send(JSON.stringify(data));

    } catch (error) {
        alert(error);
        loadIndex();
        return
    }

}

//----------------------------------------------------------------------------------
//DESBLOQUEAR MARCAÇÃO--------------------------------------------------------------
//----------------------------------------------------------------------------------

function desbloquearMarcacao(idButton){

    var SelectFunc = document.getElementById('selectFuncionarios');
    var Func = SelectFunc.getElementsByTagName('option')[SelectFunc.selectedIndex];

    //CAPTURAR AS VARIÁVEIS PARA A DESBLOQUEAR NO BANCO
    var funcionario = Func.value //MATRICULA
    var dia = idButton;

    dia = dia.substring(6,10) + '-' + dia.substring(3,5) + '-' + dia.substring(0,2);    

    //PRECISA SELECIONAR UM FUNCIONÁRIO VÁLIDO
    if (Func.text === '---') {
        alert ('ESTE FUNCIONÁRIO NÃO É VÁLIDO');
        loadIndex();
        return;
    }

    //INSERIR NO BANCO
    var url = '/desbloquearMarcacao'

    //MANDANDO POST DE CRIAÇÃO DE LANÇAMENTO PARA O SERVIDOR
    var xhr = new XMLHttpRequest();
    try {

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                switch(xhr.responseText) {
                    case 'UPDATE - SUCESS':
                        alert('MARCAÇAO DESBLOQUEADA COM SUCESSO');
                        tableCreate();
                        break;
                    case 'UPDATE - FAIL':
                        alert ('A MARCAÇÃO NÃO PODE SER DESBLOQUEADA, ATUALIZE A PÁGINA E TENTE NOVAMENTE');
                        tableCreate()
                        break;
                    default:
                      alert (xhr.responseText);
                      break;
                  }
            }
        }
            var data = {
                matricula: funcionario,
                dia: dia
            }

        xhr.send(JSON.stringify(data));

    } catch (error) {
        alert(error);
        loadIndex();
        return
    }

}

// Closure
(function(){

	/**
	 * Ajuste decimal de um número.
	 *
	 * @param	{String}	type	O tipo de arredondamento.
	 * @param	{Number}	value	O número a arredondar.
	 * @param	{Integer}	exp		O expoente (o logaritmo decimal da base pretendida).
	 * @returns	{Number}			O valor depois de ajustado.
	 */
	function decimalAdjust(type, value, exp) {
		// Se exp é indefinido ou zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// Se o valor não é um número ou o exp não é inteiro...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Transformando para string
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Transformando de volta
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Arredondamento decimal
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal arredondado para baixo
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal arredondado para cima
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}

})();

