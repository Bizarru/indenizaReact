import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    empresa: "",
    local: "",
    tipoServico: "",
    ug: "",
    numeroProcesso: "",
    competenciaMes: "",
    competenciaAno: "",
  });
  const [processos, setProcessos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      empresa,
      local,
      tipoServico,
      ug,
      numeroProcesso,
      competenciaMes,
      competenciaAno,
    } = formData;

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
      return;
    }

    setErrorMessage("");

    const query = new URLSearchParams(formData).toString();

    fetch(`http://localhost:3000/pesquisar?${query}`)
      .then((response) => response.json())
      .then((data) => {
        setProcessos(data);
      });
  };

  const showModal = (processo) => {
    setSelectedProcesso(processo);
  };

  const closeModal = () => {
    setSelectedProcesso(null);
  };

  return (
    <div className="App">
      <h1>Pesquisar Processos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Empresa:
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Local:
          <input
            type="text"
            name="local"
            value={formData.local}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Tipo de Serviço:
          <input
            type="text"
            name="tipoServico"
            value={formData.tipoServico}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          UG:
          <input
            type="text"
            name="ug"
            value={formData.ug}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Número do Processo:
          <input
            type="text"
            name="numeroProcesso"
            value={formData.numeroProcesso}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Competência Mês:
          <select
            name="competenciaMes"
            value={formData.competenciaMes}
            onChange={handleChange}
          >
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
        </label>
        <br />
        <br />
        <label>
          Competência Ano:
          <input
            type="text"
            name="competenciaAno"
            value={formData.competenciaAno}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <button type="submit">Pesquisar</button>
      </form>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="cards-container">
        {processos.map((processo, index) => (
          <div className="card" key={index} onClick={() => showModal(processo)}>
            <h3>{processo.CREDOR}</h3>
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
              <strong>Competência Mês:</strong> {processo["COMPETENCIA MES"]}
            </p>
            <p>
              <strong>Competência Ano:</strong> {processo["COMPETENCIA ANO"]}
            </p>
          </div>
        ))}
      </div>

      {selectedProcesso && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <strong>Competência Mês:</strong>{" "}
              {selectedProcesso["COMPETENCIA MES"]}
            </p>
            <p>
              <strong>Competência Ano:</strong>{" "}
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
