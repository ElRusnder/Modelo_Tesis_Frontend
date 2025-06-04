import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [departamento, setDepartamento] = useState("");
  const [cultivoRecomendado, setCultivoRecomendado] = useState(null);
  const [grafico, setGrafico] = useState(null);
  const [graficoBarras, setGraficoBarras] = useState(null);
  const [analisisTexto, setAnalisisTexto] = useState(null);
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewResults, setViewResults] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const handleChange = (e) => {
    setDepartamento(e.target.value);
  };

  const handleSubmit = async () => {
    if (!departamento || !startYear || !startMonth || !endYear || !endMonth) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    // Validación de rango de fechas
    const startDate = new Date(`${startYear}-${startMonth}-01`);
    const endDate = new Date(`${endYear}-${endMonth}-01`);

    if (startDate > endDate) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin. Por favor, corrige el rango.");
      return;
    }
    setLoading(true);
    setError("");
    setViewResults(true);

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', {
        departamento,
        start_year: startYear,
        start_month: startMonth,
        end_year: endYear,
        end_month: endMonth,
      });

      setGrafico(response.data.grafico);
      setGraficoBarras(response.data.grafico_barras);
      setAnalisisTexto(response.data.analisis_texto);
      setCultivoRecomendado(response.data.cultivo_recomendado);
      setCalendario(response.data.calendario); // Calendario recibido del backend
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Mensaje enviado desde el backend
      } else {
        setError("Hubo un error al obtener la predicción.");
      }
    }finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setViewResults(false);
    setDepartamento("");
    setStartYear("");
    setStartMonth("");
    setEndYear("");
    setEndMonth("");
    setGrafico(null);
    setGraficoBarras(null);
    setAnalisisTexto(null);
    setCultivoRecomendado(null);
    setCalendario(null);
    setError("");
  };

  return (
      <div className="App">
        <div className="main-content">
          <h1 className="header">Predicción de Clima por Departamento</h1>

          {!viewResults && (
              <div className="department-selection">
                <h2>Selecciona un Departamento</h2>
                <select className="department-select" value={departamento} onChange={handleChange}>
                  <option value="">Selecciona un Departamento</option>
                  <option value="Junín">Junín</option>
                  <option value="Ayacucho">Ayacucho</option>
                  <option value="Cusco">Cusco</option>
                  <option value="Puno">Puno</option>
                </select>

                <h2>Selecciona el Año y Mes de Inicio</h2>
                <select className="year-month-select" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                  <option value="">Año</option>
                  {[...Array(9)].map((_, index) => {
                    const year = 2025 + index;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <select className="year-month-select" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                  <option value="">Mes</option>
                  {[...Array(12)].map((_, index) => {
                    return <option key={index} value={index + 1}>{index + 1}</option>;
                  })}
                </select>

                <h2>Selecciona el Año y Mes de Finalización</h2>
                <select className="year-month-select" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                  <option value="">Año</option>
                  {[...Array(9)].map((_, index) => {
                    const year = 2025 + index;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <select className="year-month-select" value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                  <option value="">Mes</option>
                  {[...Array(12)].map((_, index) => {
                    return <option key={index} value={index + 1}>{index + 1}</option>;
                  })}
                </select>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Cargando...' : 'Obtener Predicción'}
                </button>

                {error && <p className="error-message">{error}</p>}
              </div>
          )}

          {viewResults && (
              <div className="results">
                {cultivoRecomendado && (
                    <div className="cultivo-recomendado-section">
                      <h2>Cultivo Recomendado:</h2>
                      <h3>{cultivoRecomendado.cultivo_recomendado}</h3>
                      <p><strong>Recomendación de Riego:</strong> {cultivoRecomendado.recomendacion_riego}</p>
                      <p><strong>Descripción del Cultivo:</strong> {cultivoRecomendado.descripcion_cultivo}</p>
                    </div>
                )}

                {calendario && (
                    <div className="calendario-section">
                      <h2>Calendario de Siembra y Cosecha</h2>
                      <p><strong>Meses recomendados de siembra:</strong>
                        {calendario.siembra?.[0] === "No se identificaron meses óptimos"
                            ? "No se identificaron meses óptimos"
                            : calendario.siembra.join(', ')
                        }
                      </p>

                      <p><strong>Meses estimados de cosecha:</strong>
                        {calendario.cosecha?.[0] === "No disponible"
                            ? "No disponible"
                            : calendario.cosecha.join(', ')
                        }
                      </p>

                    </div>
                )}


                {graficoBarras && (
                    <div className="graph-section">
                      <h2>Predicción de Temperatura:</h2>
                      <img src={`data:image/png;base64,${graficoBarras}`} alt="Gráfico de predicción de temperatura"/>
                    </div>
                )}

                {grafico && (
                    <div className="map-section">
                      <h2>Mapa de Calor:</h2>
                      <iframe
                          src={`data:text/html;base64,${grafico}`}
                          width="100%"
                          height="400px"
                          title="Mapa de Calor"
                          style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                      ></iframe>
                    </div>
                )}

                {analisisTexto && (
                    <div className="analysis-section">
                      <h2>Análisis de la Predicción:</h2>
                      <p>{analisisTexto}</p>
                    </div>
                )}

                <button className="back-btn" onClick={handleBack}>Volver a Selección de Departamento</button>
              </div>
          )}
        </div>
      </div>
  );
}

export default App;
