import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import "./App.css";

const App = () => {
  const { register, handleSubmit } = useForm();
  const [processos, setProcessos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [showExportButton, setShowExportButton] = useState(false);
  const [showResultadopesquisa, setShowResultadopesquisa] = useState(false);

  const onSubmit = (data) => {
    const {
      empresa,
      local,
      tipoServico,
      ug,
      numeroProcesso,
      competenciaMes,
      competenciaAno,
    } = data;

    if (
      !empresa &&
      !local &&
      !tipoServico &&
      !ug &&
      !numeroProcesso &&
      !competenciaMes &&
      !competenciaAno
    ) {
      setErrorMessage("Por favor, insira dados para a pesquisa.");
      setProcessos([]);
      return;
    }

    setErrorMessage("");
    const query = new URLSearchParams(data).toString();

    fetch(`http://localhost:3000/pesquisar?${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setErrorMessage("Nenhum resultado encontrado.");
        } else {
          setErrorMessage("");
        }
        setProcessos(data);
        setShowExportButton(true);
        setShowResultadopesquisa(true);
      });
  };
  //função para fechar o popUP
  const closeModal = () => {
    setSelectedProcesso(null);
  };
  //função para abrir o popUp
  const showModal = (processo) => {
    setSelectedProcesso(processo);
  };
  //função que exporta o resultado da pesquisa para excel
  const exportarParaExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(processos);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Processos");

    const excelBlob = new Blob(
      [s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/octet-stream",
      }
    );

    const url = window.URL.createObjectURL(excelBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processos.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  //Formulário com seus respectivos inputs!
  return (
    <div className="App">
      <div className="formulario">
        <h1 className="Titulo">Pesquisar Processos</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input-style"
            type="text"
            placeholder="Empresa"
            {...register("empresa")}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Local de Serviço"
            {...register("local")}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Tipo de Serviço"
            {...register("tipoServico")}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Número do Processo"
            {...register("numeroProcesso")}
          />
          <input
            className="input-style"
            type="text"
            placeholder="UG"
            {...register("ug")}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Ano"
            {...register("competenciaAno")}
          />
          <select className="input-style" {...register("competenciaMes")}>
            <option value="">Selecione o Mês</option>
            <option value="janeiro">Janeiro</option>
            <option value="fevereiro">Fevereiro</option>
            <option value="marco">Março</option>
            <option value="abril">Abril</option>
            <option value="maio">Maio</option>
            <option value="junho">Junho</option>
            <option value="julho">Julho</option>
            <option value="agosto">Agosto</option>
            <option value="setembro">Setembro</option>
            <option value="outubro">Outubro</option>
            <option value="novembro">Novembro</option>
            <option value="dezembro">Dezembro</option>
          </select>
          <input className="Botao" type="submit" />
        </form>
      </div>
      {/* //implemenação da função mostrar resultados das pesquisas */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {showResultadopesquisa && (
        <div className="quantidade-resultados">
          Resultados encontrados: {processos.length}
        </div>
      )}
      {/* implementação do botão que exportas o resutlados das pesquisas para o formato excel */}
      {showExportButton && (
        <div>
          <button className="botaoexport" onClick={exportarParaExcel}>
            Criar Relatório
          </button>
          {/* criação ds resultados da pesquisa com cards dinâmicos */}
          <div className="cards-container">
            {processos.map((processo, index) => (
              <div
                className="card"
                key={index}
                onClick={() => showModal(processo)}
              >
                <h3 className="Empresa">{processo.CREDOR}</h3>
                <p>
                  <strong>Local:</strong> {processo.LOCAL}
                </p>
                <p>
                  <strong>Serviço:</strong> {processo.SERVIÇO}
                </p>
                <p>
                  <strong>UG:</strong> {processo.UG}
                </p>
                <p>
                  <strong>Processo:</strong> {processo.PROCESSO}
                </p>
                <p>
                  <strong>Mês de Competência:</strong>{" "}
                  {processo["COMPETENCIA MES"]}
                </p>
                <p>
                  <strong>Ano de Competência:</strong>{" "}
                  {processo["COMPETENCIA ANO"]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* criação dos popUP com as informações completas */}
      {selectedProcesso && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>{selectedProcesso.CREDOR}</h3>
            <p>
              <strong>CNPJ:</strong> {selectedProcesso.CNPJ}
            </p>
            <p>
              <strong>Local:</strong> {selectedProcesso.LOCAL}
            </p>
            <p>
              <strong>Serviço:</strong> {selectedProcesso.SERVIÇO}
            </p>
            <p>
              <strong>UG:</strong> {selectedProcesso.UG}
            </p>
            <p>
              <strong>Código UG:</strong> {selectedProcesso["COD UG"]}
            </p>
            <p>
              <strong>Processo:</strong> {selectedProcesso.PROCESSO}
            </p>
            <p>
              <strong>Mês de Competência:</strong>{" "}
              {selectedProcesso["COMPETENCIA MES"]}
            </p>
            <p>
              <strong>Ano de Competência:</strong>{" "}
              {selectedProcesso["COMPETENCIA ANO"]}
            </p>
            <p>
              <strong>Classificação:</strong> {selectedProcesso.CLASSIFICACAO}
            </p>
            <p>
              <strong>Capital/Interior:</strong>{" "}
              {selectedProcesso.CAPITAL_INTERIOR}
            </p>
            <p>
              <strong>Data da Tramitação:</strong>{" "}
              {selectedProcesso["DATA DA TRAMITAÇÃO"]}
            </p>
            <p>
              <strong>Abertura do Processo:</strong>{" "}
              {selectedProcesso["ABERTURA DO PROCESSO"]}
            </p>
            <p>
              <strong>Status do Processo:</strong>{" "}
              {selectedProcesso["STATUS DO PROCESSO"]}
            </p>
            <p>
              <strong>Valor Faturado:</strong>{" "}
              {selectedProcesso["VALOR FATURADO"]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
