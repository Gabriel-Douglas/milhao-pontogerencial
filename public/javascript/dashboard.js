var backgroundColorMilhao = ['#FF5906', '#FC6C2B','#FF7E3E','#FFBC8F','#FFA412','#FFC215','#033A3D','#0E6B55','#0BAF84','#3BDBC7','#092541','#9100','#2B2B2B','#3F3F3F','#777775']

var indexGerente = 0;
var indexDepartamento = 0;
var indexCargo = 0;

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE LINHA DE HORAS POR DIA---------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
const ctxHorasDias = document.getElementById('GrafDiarioHoras');
const GraficoHorasDia = new Chart(ctxHorasDias, {
  type: 'line',
  plugins: [ChartDataLabels],
  data: {
      labels: [],
      datasets: [{
        label: "Horas",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: []
      }],
  },
  options: {
      plugins:{
          datalabels: {
              anchor: 'end',
              align: 'end',
              offset: 4,
              color: 'black',
              font: {
                  size: 15,
                  weight: 'bold'
              }
          }
      }
  }

});

//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE ROSCA DE HORAS POR DEPARTAMENTO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

const ctxHorasDepartamento = document.getElementById('GrafHorasDepartamento');
const GraficoHorasDepartamento = new Chart(ctxHorasDepartamento, {
  type: 'doughnut',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: backgroundColorMilhao,
      // hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    plugins:{
      datalabels: {
          anchor: 'center',
          align: 'center',
          offset: 4,
          color: 'black',
          font: {
              size: 15,
              weight: 'bold'
          }
      }
  },
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});

//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE BARRA DE HORAS POR FUNCIONÁRIO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

const ctxHorasFuncionario = document.getElementById('GrafHorasFuncionario');
const GraficoHorasFuncionario = new Chart(ctxHorasFuncionario, {
  type: 'bar',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: [{
      label: "Total de Horas",
      backgroundColor: "#092541",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#0091E2",
      data: [],
    }],
  },
  options: {
      plugins:{
        datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            color: 'black',
            font: {
                size: 15,
                weight: 'bold'
            }
        }
      },
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10
    },
  }
});



//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE BARRA DE HORAS POR FUNCIONÁRIO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

const ctxHorasCargo = document.getElementById('GrafHorasCargo');
const GraficoHorasCargo = new Chart(ctxHorasCargo, {
  type: 'bar',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: [{
      label: "Total de Horas",
      backgroundColor: "#FFA412 ",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#FFC215",
      data: [],
    }],
  },
  options: {
      plugins:{
        datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            color: 'black',
            font: {
                size: 15,
                weight: 'bold'
            }
        }
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10
    },
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  chart.update();
}

function onLoad(){

  SetDataInicial()

  var dataInicial = document.getElementById("dataInicial").value
  var dataFinal = document.getElementById("dataFinal").value

  var SelGerente = document.getElementById("ddGerente")
  var gerente = SelGerente.getElementsByTagName('option')[SelGerente.selectedIndex].value;

  atualizarCards(dataInicial, dataFinal, gerente);
  graficoDiarioHoras(dataInicial, dataFinal, gerente);
  graficoHorasDepartamento(dataInicial, dataFinal, gerente);
  graficoHorasFuncionario(dataInicial, dataFinal, gerente);
  graficoHorasCargo(dataInicial, dataFinal, gerente);
  ranking(dataInicial, dataFinal, gerente);

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

  //ANO FINAL
  if (dataAtual.getMonth() == 11 && dataAtual.getDate() > 21) dataFinal.push(dataAtual.getFullYear()+1) 
  else dataFinal.push(dataAtual.getFullYear())

  //MÊS FINAL
  if (dataInicial[1] == 11) dataFinal.push(0)
  else dataFinal.push(dataInicial[1] + 1)

  //DIA FINAL
  dataFinal.push('21')

  document.getElementById("dataInicial").value = dataInicial[0].toString() + '-' +  ("00" + (dataInicial[1] + 1)).slice(-2).toString() + '-' + dataInicial[2].toString()
  document.getElementById("dataFinal").value = dataFinal[0].toString() + '-' +  ("00" + (dataFinal[1] + 1)).slice(-2).toString() + '-' + dataFinal[2].toString()

}

function AtualizarGraficos(){

  var dataInicial = document.getElementById("dataInicial").value
  var dataFinal = document.getElementById("dataFinal").value

  // var SelCargo = document.getElementById("ddCargo")
  // var SelDepartamento = document.getElementById("ddDepartamento")

  // if(SelCargo.selectedIndex >= 0){
  //   var cargo = SelCargo.getElementsByTagName('option')[SelCargo.selectedIndex].value; 
  // } else{
  //   var cargo = "";
  // }

  // if(SelDepartamento.selectedIndex >= 0){
  //   var departamento = SelDepartamento.getElementsByTagName('option')[SelDepartamento.selectedIndex].value;
  // }else{
  //   var departamento = "";
  // }

  var SelGerente = document.getElementById("ddGerente")
  if(SelGerente.selectedIndex >= 0){
    var gerente = SelGerente.getElementsByTagName('option')[SelGerente.selectedIndex].value;
  }else{
    alert("ERRO: SELECIONE UM GERENTE")
    return;
  }

  atualizarCards(dataInicial, dataFinal, gerente);
  graficoDiarioHoras(dataInicial, dataFinal, gerente);
  graficoHorasDepartamento(dataInicial, dataFinal, gerente);
  graficoHorasFuncionario(dataInicial, dataFinal, gerente);
  graficoHorasCargo(dataInicial, dataFinal, gerente);
  ranking(dataInicial, dataFinal, gerente);

}


function FormatarDataJson(FieldDateJson){

  var count = Object.keys(FieldDateJson).length;
  var DatasFormatadas = [];
  var index = 0;
  
  while (index < count) {

    var date = new Date(FieldDateJson[index])
    date.setDate(date.getDate() + 1);
    var x = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) //+ '/' + date.getFullYear()

    DatasFormatadas.push(x);
    index += 1;
  }
  
  return DatasFormatadas

}

function PrimeiroNome(FieldNameJson){

  var count = Object.keys(FieldNameJson).length;
  var Nomes = [];
  var index = 0;
  
  while (index < count) {

    var nome = FieldNameJson[index].split(' ')[0]
    Nomes.push(nome);
    index += 1;
  }
  
  return Nomes

}

// function dropDepartamentos(){

//   var ddGerente = document.getElementById('ddGerente')
//   var ddDepartamento = document.getElementById('ddDepartamento')

//   var gerente = ddGerente.getElementsByTagName('option')[ddGerente.selectedIndex].textContent
//   indexGerente = ddGerente.selectedIndex

//     //GET DATA SOURCE
//     const url = "dashboard/departamentogerente/" + gerente.toUpperCase();

//     //alert(url)
  
//     fetch(url)  
//       .then(  
//         function(response) {  
//           if (response.status !== 200) {  
//             console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
//             return;  
//           }
    
//           // Examine the text in the response  
//           ddDepartamento.options.length = 0;
//           let option;
//           response.json().then(function(data) {  

//             for (let i = 0; i < data.length; i++) {
//               option = document.createElement('option');
//               option.text = data[i].DEPARTAMENTO;
//               option.value = data[i].DEPARTAMENTO;
//               ddDepartamento.add(option);
//             } 

//           });  
//         }  
//       )  
//       .catch(function(err) {  
//         console.error('Fetch Error -', err);  
//       });

// }

// function dropCargos(){

//   var ddDepartamento = document.getElementById('ddDepartamento')
//   var ddCargo = document.getElementById('ddCargo')

//   var departamento = ddDepartamento.getElementsByTagName('option')[ddDepartamento.selectedIndex].value
//   indexDepartamento = ddDepartamento.selectedIndex;

//     //GET DATA SOURCE
//     const url = "dashboard/cargosdepartamento/" + departamento.toUpperCase();

//     //alert(url)
  
//     fetch(url)  
//       .then(  
//         function(response) {  
//           if (response.status !== 200) {  
//             console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
//             return;  
//           }
    
//           // Examine the text in the response  
//           ddCargo.options.length = 0;
//           let option;
//           response.json().then(function(data) {  

//             for (let i = 0; i < data.length; i++) {
//               option = document.createElement('option');
//               option.text = data[i].CARGO;
//               option.value = data[i].CARGO;
//               ddCargo.add(option);
//             } 

//           });  
//         }  
//       )  
//       .catch(function(err) {  
//         console.error('Fetch Error -', err);  
//       });

// }

// function dropGerentes(){

//   var ddDepartamento = document.getElementById('ddDepartamento')
//   var ddGerente = document.getElementById('ddGerente')

//   var departamento = ddDepartamento.getElementsByTagName('option')[ddDepartamento.selectedIndex].value
//   indexDepartamento = ddDepartamento.selectedIndex;

//     //GET DATA SOURCE
//     const url = "dashboard/gerentedepartamento/" + departamento.toUpperCase();

//     //alert(url)
  
//     fetch(url)  
//       .then(  
//         function(response) {  
//           if (response.status !== 200) {  
//             console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
//             return;  
//           }
    
//           // Examine the text in the response  
//           ddGerente.options.length = 0;
//           let option;
//           response.json().then(function(data) {  

//             for (let i = 0; i < data.length; i++) {
//               option = document.createElement('option');
//               option.text = data[i].APONTADOR;
//               option.value = data[i].APONTADOR;
//               ddGerente.add(option);
//             } 

//           });  
//         }  
//       )  
//       .catch(function(err) {  
//         console.error('Fetch Error -', err);  
//       });

// }

// function AtualizarCargoGerente(){
//   dropCargos()
//   dropGerentes()
// }

//------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------CARDS----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

function atualizarCards(dtIni,dtFim,gerente){

  //GET DATA SOURCE
  const url = "/dashboard/cards/" + dtIni + "/" + dtFim + "/" + gerente;
  
  fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
          return;  
        }
  
        // Examine the text in the response  
        response.json().then(function(data) {  
          
          var elTotalHoraExtra = document.getElementById('labelTotalHoraExtra')
          var elValorHoraExtra = document.getElementById('labelValorHoraExtra')
          var elDiasRestantes= document.getElementById('labelDiasRestantes')

          elTotalHoraExtra.textContent = (data.horas /60).toFixed(2)
          elValorHoraExtra.textContent = data.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          elDiasRestantes.textContent = data.dias + " Dias"

        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });

}


//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE LINHA DE HORAS POR DIA---------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

function graficoDiarioHoras(dtIni,dtFim,gerente){

    //GET DATA SOURCE

    const url = "/dashboard/graficoHorasDia/" + dtIni + "/" + dtFim + "/" + gerente;
    
    fetch(url)  
      .then(  
        function(response) {  
          if (response.status !== 200) {  
            console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
            return;  
          }
    
          // Examine the text in the response  
          response.json().then(function(data) {  

            var labelsDATA = data.map(function(item, indice){
              return item.DATA;
            });

            var LabelsFormatado = FormatarDataJson(labelsDATA)

            var DATA = data.map(function(item, indice){
              return item.TOTAL_HORAS;
            });

            GraficoHorasDia.config.data.labels = LabelsFormatado;
            GraficoHorasDia.config.data.datasets[0].data = DATA;
            GraficoHorasDia.update();

          });  
        }  
      )  
      .catch(function(err) {  
        console.error('Fetch Error -', err);  
      });

}

//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE ROSCA DE HORAS POR DEPARTAMENTO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function graficoHorasDepartamento(dtIni,dtFim,gerente){

  //GET DATA SOURCE
  const url = "/dashboard/graficoHorasDepartamento/" + dtIni + "/" + dtFim + "/" + gerente;
  
  fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
          return;  
        }
  
        // Examine the text in the response  
        response.json().then(function(data) {  

          var labelsDEPARTAMENTO = data.map(function(item, indice){
            return item.DEPARTAMENTO;
          });
        
          var DATA = data.map(function(item, indice){
            return item.TOTAL_HORAS;
          });

          GraficoHorasDepartamento.config.data.labels = labelsDEPARTAMENTO;
          GraficoHorasDepartamento.config.data.datasets[0].data = DATA;
          GraficoHorasDepartamento.update();


        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });

}

function CriarGraficoRosca(dataSource){

}

//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE BARRA DE HORAS POR FUNCIONÁRIO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function graficoHorasFuncionario(dtIni,dtFim,gerente){

  //GET DATA SOURCE
  const url = "/dashboard/graficoHorasFuncionario/" + dtIni + "/" + dtFim + "/" + gerente;
  
  fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
          return;  
        }
  
        // Examine the text in the response  
        response.json().then(function(data) {  

          var labelsFUNCIONARIO= data.map(function(item, indice){
            return item.NOME;
          });
        
          var LabelsNome = PrimeiroNome(labelsFUNCIONARIO)
        
          var DATA = data.map(function(item, indice){
            return item.TOTAL_HORAS;
          });

          GraficoHorasFuncionario.config.data.labels = LabelsNome;
          GraficoHorasFuncionario.config.data.datasets[0].data = DATA;
          GraficoHorasFuncionario.update();

        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });

}


//---------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------GRAFICO DE BOLHA DE HORAS POR CARGO---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function graficoHorasCargo(dtIni,dtFim,gerente){

  //GET DATA SOURCE
  const url = "/dashboard/graficoHorasCargo/" + dtIni + "/" + dtFim + "/" + gerente;
  
  fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
          return;  
        }
  
        // Examine the text in the response  
        response.json().then(function(data) {  
          var labelsCARGOS= data.map(function(item, indice){
            return item.CARGO;
          });
        
          var DATA = data.map(function(item, indice){
            return item.TOTAL_HORAS;
          });

          GraficoHorasCargo.config.data.labels = labelsCARGOS;
          GraficoHorasCargo.config.data.datasets[0].data = DATA;
          GraficoHorasCargo.update();

        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });

}

//----------------------------------------------------------------------------------------------------------
//------------------------------------------------------RANKING---------------------------------------------
//----------------------------------------------------------------------------------------------------------

function ranking(dtIni,dtFim,gerente){

  //GET DATA SOURCE
  const url = "/dashboard/ranking/" + dtIni + "/" + dtFim + "/" + gerente;
  
  var tabela = document.getElementById("tblRanking");
  var old_tbody = document.getElementById("tbody-ranking");

  var new_tbody = document.createElement('tbody')
  new_tbody.id = "tbody-ranking"


  fetch(url)  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.warn('Ocorreu algum problema. Status Code: ' + response.status);  
          return;  
        }

        // Examine the text in the response  
        response.json().then(function(data) {  
          
          for (let i = 0; i < data.length; i++) {
              
              var tr = tabela.insertRow();

              //RANKING
              var td = tr.insertCell();
              td.textContent = data[i]['#']

              //NOME
              var td = tr.insertCell();
              td.textContent = data[i].NOME

              //CARGO
              var td = tr.insertCell();
              td.textContent = data[i].CARGO

              //CDC
              var td = tr.insertCell();
              td.textContent = data[i].CDC

              //DEPARTAMENTO
              var td = tr.insertCell();
              td.textContent = data[i].DEPARTAMENTO
              //TOTAL
              var td = tr.insertCell();
              td.textContent = data[i].TOTAL

              new_tbody.appendChild(tr)
          }
          
          old_tbody.parentNode.replaceChild(new_tbody, old_tbody)

        });

        

        // if(document.getElementById('tbody-ranking').getElementsByTagName('tr').length > 0) {
        //   document.getElementById('tbody-ranking').remove()
        // }

      } 
    )
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });

}